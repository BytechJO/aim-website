"use client";

import Image from "next/image";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

type Props = {
  values: (string | File)[];
  onChange: (images: (string | File)[]) => void;
};

function SortableImage({
  image,
  index,
  onRemove,
}: {
  image: string | File;
  index: number;
  onRemove: (index: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: index.toString(),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 250ms cubic-bezier(0.2, 0, 0, 1)",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative
        h-18
        w-18
        overflow-hidden
        rounded-lg
        border
        border-[#D7D9DF]
        bg-white
        transition-all
        duration-200
        ${
          isDragging
            ? "scale-110 shadow-2xl z-50 opacity-80"
            : "shadow-sm hover:shadow-md"
        }
      `}
    >
      <div className="h-full w-full">
        <Image
          src={typeof image === "string" ? image : URL.createObjectURL(image)}
          alt=""
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      <button
        type="button"
        className="
          absolute
          left-1
          top-1
          flex
          h-5
          w-5
          items-center
          justify-center
          rounded-full
          bg-black/70
          text-[10px]
          text-white
          cursor-grab
          active:cursor-grabbing
        "
        {...attributes}
        {...listeners}
      >
        ⋮⋮
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove(index);
        }}
        className="
          absolute
          right-1
          top-1
          flex
          h-5
          w-5
          items-center
          justify-center
          rounded-full
          bg-red-500
          text-xs
          text-white
          hover:bg-red-600
        "
      >
        ✕
      </button>
    </div>
  );
}

export default function ImageGalleryUploader({ values, onChange }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const removeImage = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
  <div className="flex flex-wrap gap-2">
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={({ active, over }) => {
        if (!over) return;

        const oldIndex = Number(active.id);
        const newIndex = Number(over.id);

        if (oldIndex === newIndex) return;

        onChange(arrayMove(values, oldIndex, newIndex));
      }}
    >
      <SortableContext
        items={values.map((_, i) => i.toString())}
        strategy={rectSortingStrategy}
      >
        <div className="flex flex-wrap gap-2">
          {values.map((image, index) => (
            <SortableImage
              key={index}
              image={image}
              index={index}
              onRemove={removeImage}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>

    <label
      className="
        flex
        h-18
        w-18
        cursor-pointer
        flex-col
        items-center
        justify-center
        rounded-lg
        border
        border-dashed
        border-[#D7D9DF]
        text-[#707070]
        transition
        hover:border-[#285FE7]
        hover:text-[#285FE7]
      "
    >
      <input
        type="file"
        accept="image/*,.svg"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);

          if (files.length) {
            onChange([...values, ...files]);
          }

          e.target.value = "";
        }}
      />

      <span className="text-xl">+</span>
      <span className="text-[9px] font-bold uppercase">Add</span>
    </label>
  </div>
);
}
