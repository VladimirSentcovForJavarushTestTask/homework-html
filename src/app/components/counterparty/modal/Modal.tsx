import React from 'react';
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextInput,
} from 'flowbite-react';
import { CounterpartyFormData } from '../../../types';
import { useCounterpartyContext } from '../../../context/CounterpartyContext';
import { Field, FieldInputProps, Form } from 'react-final-form';
import { validate } from './ModalFormValidator';

/**
 * Modal component for creating and editing counterparties
 *
 * This component provides a form interface for creating new counterparties or editing existing ones.
 * It handles form validation, data submission, and error display using React Final Form.
 *
 * Features:
 * - Form validation for all fields (name, INN, address, KPP)
 * - Real-time validation feedback
 * - Support for both create and edit modes
 * - Error message display
 * - Color-coded input fields based on validation state
 *
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

  // Initial form state
  const initialFormData: CounterpartyFormData = {
    name: '',
    inn: '',
    address: '',
    kpp: '',
    ...counterparty,
  };

  type fieldMeta = {
    dirty?: boolean;
    error?: any;
    touched?: boolean;
  };

  const getColor = ({ error, dirty, touched }: fieldMeta, input: FieldInputProps) => {
    return error && (touched || dirty) ? 'failure' : input.value ? 'success' : 'gray';
  };

  const renderError = ({ error, dirty, touched }: fieldMeta) => {
    if (error && (touched || dirty)) {
      return <p className="text-red-600 text-xs mt-1">{error}</p>;
    }
    return null;
  };

  return (
    <Modal show={isOpen} onClose={onClose}>
      <Form
        onSubmit={async (values) => {
          await onSave(values);
          onClose();
        }}
        initialValues={initialFormData}
        validate={validate}
        render={({ handleSubmit, submitting, invalid }) => (
          <>
            <ModalHeader>
              {counterparty ? 'Редактировать контрагента' : 'Новый контрагент'}
            </ModalHeader>
            <ModalBody>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name field */}
                <Field name="name">
                  {({ input, meta }) => (
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="name">Название</Label>
                      </div>
                      <TextInput
                        {...input}
                        id="name"
                        required
                        placeholder="МойСклад"
                        minLength={1}
                        color={getColor(meta, input)}
                      />
                      {renderError(meta)}
                    </div>
                  )}
                </Field>

                {/* INN field */}
                <Field name="inn">
                  {({ input, meta }) => (
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="inn">ИНН</Label>
                      </div>
                      <TextInput
                        {...input}
                        id="inn"
                        required
                        color={getColor(meta, input)}
                        placeholder="12345678901"
                        inputMode="numeric"
                        maxLength={11}
                        minLength={11}
                      />
                      {renderError(meta)}
                    </div>
                  )}
                </Field>

                {/* Address field */}
                <Field name="address">
                  {({ input, meta }) => (
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="address">Адрес</Label>
                      </div>
                      <TextInput
                        {...input}
                        id="address"
                        required
                        color={getColor(meta, input)}
                        placeholder="Москва, ул. Ленина, д. 1"
                        minLength={1}
                      />
                      {renderError(meta)}
                    </div>
                  )}
                </Field>

                {/* KPP field */}
                <Field name="kpp">
                  {({ input, meta }) => (
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="kpp">КПП</Label>
                      </div>
                      <TextInput
                        {...input}
                        id="kpp"
                        required
                        color={getColor(meta, input)}
                        placeholder="123456789"
                        inputMode="numeric"
                        maxLength={9}
                        minLength={9}
                      />
                      {renderError(meta)}
                    </div>
                  )}
                </Field>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button color="gray" onClick={onClose}>
                Отмена
              </Button>
              <Button type="submit" onClick={handleSubmit} disabled={submitting || invalid}>
                Сохранить
              </Button>
            </ModalFooter>
          </>
        )}
      />
    </Modal>
  );
};

export default CounterpartyModal;
