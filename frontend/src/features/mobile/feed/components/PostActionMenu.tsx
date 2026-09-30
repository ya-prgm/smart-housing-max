import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { feedApi } from '../api';
import { useToast } from '../../../../shared/hooks/useToast';

interface PostActionMenuProps {
  postId: string;
  postTitle?: string;
  postContent: string;
  isOwnerOrStaff: boolean;
  onDeleted?: () => void;
}

export const PostActionMenu: React.FC<PostActionMenuProps> = ({
  postId,
  postTitle,
  postContent,
  isOwnerOrStaff,
  onDeleted,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const textToCopy = postTitle ? `${postTitle}\n\n${postContent}` : postContent;
    navigator.clipboard.writeText(textToCopy);
    showToast('Текст публикации скопирован', 'success');
    setIsOpen(false);
  };

  const handleReport = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await feedApi.reportPost(postId);
      showToast('Жалоба отправлена модераторам', 'info');
    } catch {
      showToast('Не удалось отправить жалобу', 'error');
    } finally {
      setIsOpen(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleting(true);
    try {
      await feedApi.deletePost(postId);
      showToast('Публикация удалена', 'success');
      setShowConfirmDelete(false);
      setIsOpen(false);
      onDeleted?.();
    } catch {
      showToast('Не удалось удалить публикацию', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmModal = showConfirmDelete
    ? createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn select-none"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowConfirmDelete(false);
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          <div
            className="bg-white rounded-[26px] p-5 max-w-sm w-full shadow-2xl flex flex-col gap-4 animate-scaleUp border border-slate-100"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">delete</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[16px] font-bold text-slate-900 leading-tight">Удалить публикацию?</h3>
                <p className="text-[12px] text-slate-500 mt-1">Она навсегда исчезнет из ленты дома</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowConfirmDelete(false);
                }}
                className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-700 font-semibold text-[14px] hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[14px] shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Удаление...' : 'Удалить'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <div
      className="relative"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <button
        type="button"
        aria-label="Действия с публикацией"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors active:scale-95 cursor-pointer"
      >
        <span className="material-symbols-outlined text-[20px]">more_vert</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(false);
            }}
          />
          <div
            className="absolute right-0 top-9 z-50 min-w-[190px] bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleCopy}
              className="w-full px-3.5 py-2.5 flex items-center gap-2.5 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-left"
            >
              <span className="material-symbols-outlined text-[18px] text-slate-400">content_copy</span>
              <span>Скопировать текст</span>
            </button>

            {isOwnerOrStaff ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowConfirmDelete(true);
                  setIsOpen(false);
                }}
                className="w-full px-3.5 py-2.5 flex items-center gap-2.5 text-[13px] font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
              >
                <span className="material-symbols-outlined text-[18px] text-rose-500">delete</span>
                <span>Удалить публикацию</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleReport}
                className="w-full px-3.5 py-2.5 flex items-center gap-2.5 text-[13px] font-medium text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer text-left"
              >
                <span className="material-symbols-outlined text-[18px] text-amber-500">flag</span>
                <span>Пожаловаться</span>
              </button>
            )}
          </div>
        </>
      )}

      {confirmModal}
    </div>
  );
};
