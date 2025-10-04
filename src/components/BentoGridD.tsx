import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import {
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";
import Image from "next/image";

export function BentoGridD() {
  return (
    <BentoGrid className="mx-auto max-w-7xl md:auto-rows-[30rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={item.className}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
}

const ImageHeader = ({ src, alt }: { src: string; alt: string }) => (
  <div className="relative h-full min-h-[6rem] w-full flex-1 overflow-hidden rounded-xl">
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
    />
  </div>
);

const items = [
  {
    title: "Codebase Diagrams",
    description: " Visualize project architecture and dependencies instantly, making it easy to see how different parts of the system connect.",
    header: <ImageHeader src="/bgUUUU.png" alt="Codebase Diagrams" />,
    className: "md:col-span-2",
  },
  {
    title: "Smart Explanations",
    description: "Empowering you with AI-driven workflows designed to simplify operations, enhance productivity.",
    header: <ImageHeader src="/pgNew.png" alt="Smart Explanations" />,
    className: "md:col-span-1",
  },
  {
    title: "Interactive Code Snippets",
    description: "Extract and highlight relevant snippets so developers can learn by example, not by guesswork.",
    header: <ImageHeader src="/images/code-snippets.jpg" alt="Interactive Code Snippets" />,
    className: "md:col-span-1",
  },
  {
    title: "Predictive Guidance",
    description: "Anticipate developer questions by surfacing key patterns, best practices, and potential pitfalls within the codebase.",
    header: <ImageHeader src="/images/predictive-guidance.jpg" alt="Predictive Guidance" />,
    className: "md:col-span-2",
  },
];