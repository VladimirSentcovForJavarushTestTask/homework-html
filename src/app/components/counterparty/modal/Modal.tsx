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
import { CounterpartyFormData, CounterpartyFormErrors } from '../../../types';
import { isCounterpartyValid, validateForm } from './ModalFormValidator';
import { useCounterpartyContext } from '../../../context/CounterpartyContext';

/**
 * Modal component for creating and editing counterparties
 * @returns {JSX.Element} Modal component with form
 */
const CounterpartyModal = () => {
  const {
    isModalOpen: isOpen,
    handleSave: onSave,
    editingCounterparty: counterparty,
    setIsModalOpen,
  } = useCounterpartyContext();

  const onClose = () => {
    setIsModalOpen(false);
  };

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

  const [errors, setErrors] = useState<CounterpartyFormErrors>({});

  useEffect(() => {
    if (counterparty) {
      setFormData(counterparty);
      return;
    }
    setFormData(initialFormData);
  }, [counterparty]);

  /**
   * Handles form submission
   * @param {React.FormEvent} e - Form event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateForm(formData, setErrors);
    if (isCounterpartyValid(formData)) {
      onSave(formData);
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
  const colorCalculator = (fieldName: keyof CounterpartyFormErrors) => {
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
        <Button onClick={handleSubmit} disabled={!isCounterpartyValid({ ...formData })}>
          Сохранить
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CounterpartyModal;
