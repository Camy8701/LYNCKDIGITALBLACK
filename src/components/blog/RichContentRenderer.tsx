import { SectionBadge } from "./SectionBadge";
import { ComparisonTable } from "./ComparisonTable";
import { NumberedSteps } from "./NumberedSteps";
import { FeatureCards } from "./FeatureCards";
import { CTASection } from "./CTASection";

interface RichContentRendererProps {
  content: string;
}

// Parse custom block syntax from content
function parseBlocks(content: string) {
  const blocks: Array<{ type: string; content: string; props?: Record<string, unknown> }> = [];
  
  // Split by custom block markers
  const regex = /:::(\w+)(?:\s+(.+?))?\n([\s\S]*?):::/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    // Add text before this block
    if (match.index > lastIndex) {
      const textBefore = content.slice(lastIndex, match.index).trim();
      if (textBefore) {
        blocks.push({ type: 'text', content: textBefore });
      }
    }

    const [, blockType, blockProps, blockContent] = match;
    blocks.push({
      type: blockType,
      content: blockContent.trim(),
      props: blockProps ? parseBlockProps(blockProps) : undefined,
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    const remaining = content.slice(lastIndex).trim();
    if (remaining) {
      blocks.push({ type: 'text', content: remaining });
    }
  }

  // If no blocks found, treat entire content as text
  if (blocks.length === 0 && content.trim()) {
    blocks.push({ type: 'text', content: content.trim() });
  }

  return blocks;
}

function parseBlockProps(propsString: string): Record<string, unknown> {
  const props: Record<string, unknown> = {};
  // Simple key=value or just value parsing
  const parts = propsString.split(/\s+/);
  parts.forEach((part, index) => {
    if (part.includes('=')) {
      const [key, value] = part.split('=');
      props[key] = value.replace(/"/g, '');
    } else if (index === 0) {
      props.variant = part.toLowerCase();
    }
  });
  return props;
}

function parseComparisonTable(content: string) {
  const lines = content.split('\n').filter(line => line.trim());
  const isItems: string[] = [];
  const isNotItems: string[] = [];
  
  let currentColumn: 'is' | 'isnot' | null = null;
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('## IS NOT') || trimmed.startsWith('### IS NOT')) {
      currentColumn = 'isnot';
    } else if (trimmed.startsWith('## IS') || trimmed.startsWith('### IS')) {
      currentColumn = 'is';
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const item = trimmed.replace(/^[-*]\s+/, '');
      if (currentColumn === 'is') {
        isItems.push(item);
      } else if (currentColumn === 'isnot') {
        isNotItems.push(item);
      }
    }
  });
  
  return { isItems, isNotItems };
}

function parseSteps(content: string) {
  const steps: Array<{ number: string; title: string; description: string }> = [];
  const stepRegex = /(\d+)\.\s+\*\*(.+?)\*\*\s*\n([\s\S]*?)(?=\d+\.\s+\*\*|$)/g;
  
  let match;
  while ((match = stepRegex.exec(content)) !== null) {
    steps.push({
      number: match[1].padStart(2, '0'),
      title: match[2],
      description: match[3].trim(),
    });
  }
  
  return steps;
}

function parseCards(content: string) {
  const cards: Array<{ icon?: string; title: string; description: string; highlight?: string }> = [];
  const cardRegex = /\*\*(.+?)\*\*\s*(?:\[icon:(\w+)\])?\s*\n([\s\S]*?)(?=\*\*|$)/g;
  
  let match;
  while ((match = cardRegex.exec(content)) !== null) {
    cards.push({
      title: match[1],
      icon: match[2],
      description: match[3].trim(),
    });
  }
  
  // Fallback: split by double newlines if regex didn't match
  if (cards.length === 0) {
    const sections = content.split(/\n\n+/);
    sections.forEach(section => {
      const lines = section.split('\n');
      const titleMatch = lines[0]?.match(/\*\*(.+?)\*\*/);
      if (titleMatch) {
        cards.push({
          title: titleMatch[1],
          description: lines.slice(1).join(' ').trim(),
        });
      }
    });
  }
  
  return cards;
}

function parseCTA(content: string) {
  const lines = content.split('\n').filter(line => line.trim());
  const title = lines[0]?.replace(/^#+\s*/, '').replace(/\*\*/g, '') || 'Take Action';
  const description = lines.slice(1).join(' ').trim();
  
  return { title, description };
}

// Render markdown text with proper formatting
function renderMarkdownText(text: string) {
  // Split into paragraphs and elements
  const elements: React.ReactNode[] = [];
  const lines = text.split('\n');
  let currentParagraph: string[] = [];
  let inList = false;
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const content = currentParagraph.join(' ');
      if (content.trim()) {
        elements.push(
          <p key={elements.length} className="text-foreground/80 leading-relaxed mb-4">
            {renderInlineMarkdown(content)}
          </p>
        );
      }
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={elements.length} className="list-disc list-inside space-y-2 mb-4 text-foreground/80">
          {listItems.map((item, i) => (
            <li key={i}>{renderInlineMarkdown(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    // Headers
    if (trimmed.startsWith('# ')) {
      flushParagraph();
      flushList();
      elements.push(
        <h2 key={elements.length} className="text-3xl md:text-4xl font-bold text-foreground mt-12 mb-6">
          {renderInlineMarkdown(trimmed.slice(2))}
        </h2>
      );
    } else if (trimmed.startsWith('## ')) {
      flushParagraph();
      flushList();
      elements.push(
        <h3 key={elements.length} className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">
          {renderInlineMarkdown(trimmed.slice(3))}
        </h3>
      );
    } else if (trimmed.startsWith('### ')) {
      flushParagraph();
      flushList();
      elements.push(
        <h4 key={elements.length} className="text-xl md:text-2xl font-semibold text-foreground mt-8 mb-3">
          {renderInlineMarkdown(trimmed.slice(4))}
        </h4>
      );
    }
    // Blockquotes
    else if (trimmed.startsWith('> ')) {
      flushParagraph();
      flushList();
      elements.push(
        <blockquote key={elements.length} className="border-l-4 border-primary pl-4 py-2 my-6 italic text-foreground/70 bg-primary/5 rounded-r-lg">
          {renderInlineMarkdown(trimmed.slice(2))}
        </blockquote>
      );
    }
    // List items
    else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      flushParagraph();
      if (!inList) {
        inList = true;
      }
      listItems.push(trimmed.slice(2));
    }
    // Numbered lists
    else if (/^\d+\.\s/.test(trimmed)) {
      flushParagraph();
      if (!inList) {
        inList = true;
      }
      listItems.push(trimmed.replace(/^\d+\.\s/, ''));
    }
    // Empty line
    else if (trimmed === '') {
      flushParagraph();
      flushList();
    }
    // Regular text
    else {
      if (inList) {
        flushList();
      }
      currentParagraph.push(trimmed);
    }
  });

  flushParagraph();
  flushList();

  return elements;
}

function renderInlineMarkdown(text: string): React.ReactNode {
  // Process inline markdown: bold, italic, links
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  // Simple regex-based replacements
  // Bold
  remaining = remaining.replace(/\*\*(.+?)\*\*/g, '|||BOLD:$1|||');
  // Italic
  remaining = remaining.replace(/\*(.+?)\*/g, '|||ITALIC:$1|||');
  // Links
  remaining = remaining.replace(/\[(.+?)\]\((.+?)\)/g, '|||LINK:$1:$2|||');

  const tokens = remaining.split('|||');
  tokens.forEach(token => {
    if (token.startsWith('BOLD:')) {
      parts.push(<strong key={key++} className="font-semibold text-foreground">{token.slice(5)}</strong>);
    } else if (token.startsWith('ITALIC:')) {
      parts.push(<em key={key++}>{token.slice(7)}</em>);
    } else if (token.startsWith('LINK:')) {
      const [linkText, url] = token.slice(5).split(':');
      parts.push(
        <a key={key++} href={url} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
          {linkText}
        </a>
      );
    } else if (token) {
      parts.push(token);
    }
  });

  return parts.length === 1 ? parts[0] : <>{parts}</>;
}

export function RichContentRenderer({ content }: RichContentRendererProps) {
  const blocks = parseBlocks(content);

  return (
    <div className="rich-content">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'section':
            const variant = (block.props?.variant as string) || 'default';
            return (
              <div key={index} className="mt-12 first:mt-0">
                <SectionBadge 
                  label={variant.toUpperCase()} 
                  variant={variant as 'foundation' | 'automation' | 'strategy' | 'action' | 'default'} 
                />
                <div className="mt-4">
                  {renderMarkdownText(block.content)}
                </div>
              </div>
            );

          case 'comparison':
            const { isItems, isNotItems } = parseComparisonTable(block.content);
            return <ComparisonTable key={index} isItems={isItems} isNotItems={isNotItems} />;

          case 'steps':
            const steps = parseSteps(block.content);
            return <NumberedSteps key={index} steps={steps} />;

          case 'cards':
            const cards = parseCards(block.content);
            const columns = (block.props?.columns as 2 | 3 | 4) || 3;
            return <FeatureCards key={index} cards={cards} columns={columns} />;

          case 'cta':
            const ctaProps = parseCTA(block.content);
            return (
              <CTASection
                key={index}
                title={ctaProps.title}
                description={ctaProps.description}
                variant={(block.props?.variant as 'default' | 'gradient' | 'minimal') || 'gradient'}
              />
            );

          case 'text':
          default:
            return <div key={index}>{renderMarkdownText(block.content)}</div>;
        }
      })}
    </div>
  );
}
