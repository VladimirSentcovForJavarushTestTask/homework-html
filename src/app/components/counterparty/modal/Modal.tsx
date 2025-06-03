import React, { useEffect, useState } from 'react';
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextInput,
} from 'flowbite-react';
import { Counterparty, CounterpartyFormData, FormErrors } from '../../../types';
import { isValidConteParty, validateForm } from './ModalFormValidator';

/**
 * Props for the CounterpartyModal component
 * @typedef {Object} ModalProps
 * @property {boolean} isOpen - Controls the visibility of the modal
 * @property {() => void} onClose - Callback function when modal is closed
 * @property {(data: CounterpartyFormData) => void} onSave - Callback function when form is submitted
 * @property {Counterparty} [counterparty] - Optional counterparty data for edit mode
 */
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CounterpartyFormData) => void;
  counterparty?: Counterparty;
};

/**
 * Modal component for creating and editing counterparties
 * @param {ModalProps} props - Component props
 * @returns {JSX.Element} Modal component with form
 */
const CounterpartyModal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, counterparty }) => {
  const [formData, setFormData] = useState<CounterpartyFormData>({
    name: '',
    inn: '',
    address: '',
    kpp: '',
    ...counterparty,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (counterparty) {
      setFormData(counterparty);
    }
  }, [counterparty]);

  /**
   * Handles form submission
   * @param {React.FormEvent} e - Form event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateForm(formData, setErrors);
    if (isValidConteParty(formData)) {
      onSave(formData);
      onClose();
    }
  };

  /**
   * Handles input field changes
   * @param {React.ChangeEvent<HTMLInputElement>} e - Change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const copy = { ...formData };
    if (name === 'inn' || name === 'kpp' || name === 'name' || name === 'address') {
      copy[name] = value;
    }
    validateForm(copy, setErrors);
    setFormData(copy);
  };

  return (
    <Modal show={isOpen} onClose={onClose}>
      <ModalHeader>{counterparty ? 'Редактировать контрагента' : 'Новый контрагент'}</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name">Название</Label>
            </div>
            <TextInput
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              color={errors.name ? 'failure' : undefined}
            />
            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="inn">ИНН</Label>
            </div>
            <TextInput
              id="inn"
              name="inn"
              value={formData.inn}
              onChange={handleChange}
              required
              color={errors.inn ? 'failure' : undefined}
            />
            {errors.inn && <p className="text-red-600 text-xs mt-1">{errors.inn}</p>}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="address">Адрес</Label>
            </div>
            <TextInput
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              color={errors.address ? 'failure' : undefined}
            />
            {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="kpp">КПП</Label>
            </div>
            <TextInput
              id="kpp"
              name="kpp"
              value={formData.kpp}
              onChange={handleChange}
              required
              color={errors.kpp ? 'failure' : undefined}
            />
            {errors.kpp && <p className="text-red-600 text-xs mt-1">{errors.kpp}</p>}
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="gray" onClick={onClose}>
          Отмена
        </Button>
        <Button onClick={handleSubmit} disabled={!isValidConteParty({ ...formData })}>
          Сохранить
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CounterpartyModal;
