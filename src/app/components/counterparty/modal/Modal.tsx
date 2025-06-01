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
import { Counterparty, CounterpartyFormData } from '../../../types';

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
 * Validates INN (Taxpayer Identification Number)
 * @param {string} [inn] - The INN to validate
 * @returns {boolean} True if INN is valid (11 digits), false otherwise
 */
const validateInn = (inn?: string) => {
  if (!inn) {
    return false;
  }
  return /^\d{11}$/.test(inn);
};

/**
 * Validates KPP (Tax Registration Reason Code)
 * @param {string} [kpp] - The KPP to validate
 * @returns {boolean} True if KPP is valid (9 digits), false otherwise
 */
const validateKpp = (kpp?: string) => {
  if (!kpp) {
    return false;
  }
  return /^\d{9}$/.test(kpp);
};

/**
 * Validates address
 * @param {string} [address] - The address to validate
 * @returns {boolean} True if address is not empty, false otherwise
 */
const validateAddress = (address?: string) => {
  if (!address) {
    return false;
  }
  return address.length > 0;
};

/**
 * Validates name
 * @param {string} [name] - The name to validate
 * @returns {boolean} True if name is not empty, false otherwise
 */
const validateName = (name?: string) => {
  if (!name) {
    return false;
  }
  return name.length > 0;
};

/**
 * Validates all counterparty fields
 * @param {CounterpartyFormData} counterparty - The counterparty data to validate
 * @returns {boolean} True if all fields are valid, false otherwise
 */
const isValidConteParty = (counterparty: CounterpartyFormData) => {
  return (
    validateInn(counterparty.inn) &&
    validateKpp(counterparty.kpp) &&
    validateAddress(counterparty.address) &&
    validateName(counterparty.name)
  );
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

  type FormErrors = {
    inn?: string;
    kpp?: string;
    name?: string;
    address?: string;
  };

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (counterparty) {
      setFormData(counterparty);
    }
  }, [counterparty]);

  /**
   * Validates form data and sets error messages
   * @param {CounterpartyFormData} counterparty - The counterparty data to validate
   */
  function validateForm(counterparty: CounterpartyFormData) {
    const newErrors: FormErrors = {};
    if (!validateName(counterparty.name)) {
      newErrors.name = 'Название не может быть пустым';
    }
    if (!validateAddress(counterparty.address)) {
      newErrors.address = 'Адрес не может быть пустым';
    }
    if (!validateInn(counterparty.inn)) {
      newErrors.inn = 'ИНН должен содержать 11 цифр';
    }
    if (!validateKpp(counterparty.kpp)) {
      newErrors.kpp = 'КПП должен содержать 9 цифр';
    }
    setErrors(newErrors);
  }

  /**
   * Handles form submission
   * @param {React.FormEvent} e - Form event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateForm(formData);
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
    validateForm(copy);
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
