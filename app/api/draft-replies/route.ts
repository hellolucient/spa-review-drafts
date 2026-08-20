import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

interface RequestBody {
  spaName?: string;
  voiceNotes?: string;
  reviews: string;
}

function parseReviews(text: string): string[] {
  const reviews = text
    .split(/\n\s*---\s*\n|\n\s*\n\s*\n/)
    .map((r) => r.trim())
    .filter((r) => r.length > 0);
  return reviews;
}

function generateFallbackDraft(review: string, spaName?: string): string {
  const lowerReview = review.toLowerCase();
  const spaRef = spaName || 'our spa';
  
  const hasNegative = 
    /terrible|awful|horrible|worst|bad|poor|disappointing|never|rude|dirty|cold|late|wait/.test(lowerReview);
  const hasPositive = 
    /great|excellent|amazing|wonderful|fantastic|perfect|love|best|recommend/.test(lowerReview);
  
  if (hasNegative && !hasPositive) {
    return `Thank you for sharing your feedback. We take your concerns seriously and would like the opportunity to make this right. Please reach out to us directly so we can address this with you personally.`;
  }
  
  if (hasPositive && !hasNegative) {
    return `Thank you so much for your kind words! We're thrilled you had a great experience at ${spaRef}. We look forward to welcoming you back soon!`;
  }
  
  return `Thank you for your feedback. We appreciate you taking the time to share your experience. We're always working to improve, and we'd love to welcome you back to ${spaRef}.`;
}

async function generateAIDraft(
  review: string,
  spaName?: string,
  voiceNotes?: string
): Promise<string> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const systemPrompt = `You are a spa manager writing a reply to a customer review. Follow these rules strictly:

- Write as a spa manager, not a corporate press office
- Keep it short (2-3 sentences max)
- Thank the reviewer
- If something went wrong, offer to make it right WITHOUT admitting legal fault (never say "sorry you were injured" or "we were negligent")
- Do NOT invent facts that were not in the review
- Do NOT offer refunds unless the review specifically mentioned money
- Match the reviewer's language if the review is not in English
${voiceNotes ? `- Tone: ${voiceNotes}` : ''}
${spaName ? `- Spa name: ${spaName}` : ''}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Review:\n${review}` },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    return completion.choices[0]?.message?.content?.trim() || generateFallbackDraft(review, spaName);
  } catch (error) {
    console.error('OpenAI API error:', error);
    return generateFallbackDraft(review, spaName);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { spaName, voiceNotes, reviews } = body;

    if (!reviews || typeof reviews !== 'string') {
      return NextResponse.json(
        { error: 'Reviews text is required' },
        { status: 400 }
      );
    }

    const reviewList = parseReviews(reviews);

    if (reviewList.length === 0) {
      return NextResponse.json(
        { error: 'No valid reviews found' },
        { status: 400 }
      );
    }

    const hasApiKey = !!process.env.OPENAI_API_KEY;

    const drafts = await Promise.all(
      reviewList.map(async (review) => {
        const draft = hasApiKey
          ? await generateAIDraft(review, spaName, voiceNotes)
          : generateFallbackDraft(review, spaName);
        
        return {
          review,
          draft,
        };
      })
    );

    return NextResponse.json({ drafts });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to generate drafts' },
      { status: 500 }
    );
  }
}
