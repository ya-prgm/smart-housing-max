import React, { useRef } from 'react';

interface AttachmentUploaderProps {
  attachments: { id: string | number; url: string; name: string }[];
  onAdd: (files: FileList) => void;
  onRemove: (id: string | number) => void;
  maxFiles?: number;
}

export const AttachmentUploader: React.FC<AttachmentUploaderProps> = ({
  attachments,
  onAdd,
  onRemove,
  maxFiles = 5,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAdd(e.target.files);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-[13px] font-bold text-slate-800">
          Фото и видео материалы
        </label>
        <span className="text-[11px] text-slate-400">
          {attachments.length} из {maxFiles}
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {attachments.map((att) => (
          <div
            key={att.id}
            className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 group bg-slate-100"
          >
            <img
              src={att.url}
              alt=""
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => onRemove(att.id)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center text-[13px] hover:bg-black/80 transition-all cursor-pointer"
            >
              ×
            </button>
          </div>
        ))}

        {attachments.length < maxFiles && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 hover:border-primary flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-primary transition-all cursor-pointer bg-slate-50"
          >
            <span className="material-symbols-outlined text-[24px]">add_a_photo</span>
            <span className="text-[10px] font-medium">Фото</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
