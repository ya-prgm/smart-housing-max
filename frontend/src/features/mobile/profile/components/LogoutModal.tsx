import React from 'react';
import { Modal } from '../../../../shared/ui/Modal';
import { Button } from '../../../../shared/ui/Button';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Выход из профиля"
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-slate-500">
          Вы уверены, что хотите выйти из приложения? Для повторного входа потребуется авторизация через MAX или Госуслуги.
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Отмена
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onClick={onConfirm}
          >
            Выйти
          </Button>
        </div>
      </div>
    </Modal>
  );
};
