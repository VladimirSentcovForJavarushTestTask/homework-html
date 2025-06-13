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
  const initialFormData: CounterpartyFormData = {
    name: '',
    inn: '',
    address: '',
    kpp: '',
  };
  const [formData, setFormData] = useState<CounterpartyFormData>({
    ...initialFormData,
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
      setFormData(initialFormData);
    }
  };

  /**
   * Handles input field changes
   * @param {React.ChangeEvent<HTMLInputElement>} e - Change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const copy = { ...formData };
    if (name in formData) {
      copy[name as keyof CounterpartyFormData] = value;
    }
    validateForm(copy, setErrors);
    setFormData(copy);
  };
  const colorCalculator = (fieldName: keyof FormErrors) => {
    return errors[fieldName] ? 'failure' : formData[fieldName] ? 'success' : 'gray';
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
              placeholder="МойСклад"
              title={'Name not empty'}
              minLength={1}
              color={colorCalculator('name')}
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
              color={colorCalculator('inn')}
              pattern="[0-9]{11}"
              title="ИНН должен состоять из 11 цифр"
              placeholder="12345678901"
              inputMode="numeric"
              maxLength={11}
              minLength={11}
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
              color={colorCalculator('address')}
              placeholder="Москва, ул. Ленина, д. 1"
              minLength={1}
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
              color={colorCalculator('kpp')}
              pattern="[0-9]{9}"
              title="КПП должен состоять из 9 цифр"
              placeholder="123456789"
              inputMode="numeric"
              maxLength={9}
              minLength={9}
            />
            {errors.kpp && <p className="text-red-600 text-xs mt-1">{errors.kpp}</p>}
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="gray" onClick={() => onClose()}>
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
