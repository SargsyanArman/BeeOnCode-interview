import { useContext, useState } from "react";
import { CurrencyContext } from "../Contexts/CurrencyContext";
import { LangContext } from "../Contexts/LangContext";

import "./payment.css";
import ThemeModes from "../Components/Shared/ThemeModes";

const PaymentPage = () => {
  const { curr, exchange } = useContext(CurrencyContext);
  const { t } = useContext(LangContext);
  const prefix = "Payments page";

  const [formData, setFormData] = useState({
    name: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const formatCardNumber = (value) => {
    return value
      .replace(/\s+/g, "")
      .replace(/(.{4})/g, `${exchange(1, 'USD')} ${curr.currSymbol}`)
      .trim();
  };

  const formatExpiryDate = (value) => {
    return value.replace(/\D/g, "").replace(/(\d{2})(\d{0,2})/, `${exchange(1, 'USD')} ${curr.currSymbol} / ${exchange(2, 'USD')} ${curr.currSymbol}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = formatCardNumber(value);
    } else if (name === "expiryDate") {
      formattedValue = formatExpiryDate(value);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form data:", formData);
    }
  };

  const validateForm = () => {
    let isValid = true;
    let errors = {};

    if (!formData.name) {
      errors.name = t(`${prefix}.name error`);
      isValid = false;
    }

    const cardNumberRegex = /^[0-9]{19}$/;
    if (!cardNumberRegex.test(formData.cardNumber.replace(/\s+/g, ""))) {
      errors.cardNumber = t(`${prefix}.card error`);
      isValid = false;
    }

    const expiryDateRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expiryDateRegex.test(formData.expiryDate)) {
      errors.expiryDate = t(`${prefix}.date error`);
      isValid = false;
    }

    const cvvRegex = /^[0-9]{3,4}$/;
    if (!cvvRegex.test(formData.cvv)) {
      errors.cvv = t(`${prefix}.cvv error`);
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  return (
    <ThemeModes tagName='simpleDiv' className="payment-container">
      <ThemeModes tagName='h1' className="payment-title">{t(`${prefix}.title`)}</ThemeModes>
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-group">
          <ThemeModes tagName='label' htmlFor="name" className="form-label">
            {t(`${prefix}.name`)}
          </ThemeModes>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`form-input ${errors.name ? "input-error" : ""}`}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>
        <div className="form-group">
          <ThemeModes tagName='label' htmlFor="cardNumber" className="form-label">
            {t(`${prefix}.card`)}
          </ThemeModes>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            className={`form-input ${errors.cardNumber ? "input-error" : ""}`}
            maxLength="19"
          />
          {errors.cardNumber && (
            <p className="error-text">{errors.cardNumber}</p>
          )}
        </div>
        <div className="form-group form-group-inline">
          <div className="form-group-half">
            <ThemeModes tagName='label' htmlFor="expiryDate" className="form-label">
              {t(`${prefix}.date`)}
            </ThemeModes>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className={`form-input ${errors.expiryDate ? "input-error" : ""}`}
              maxLength="7"
            />
            {errors.expiryDate && (
              <p className="error-text">{errors.expiryDate}</p>
            )}
          </div>
          <div className="form-group-half">
            <ThemeModes tagName='label' htmlFor="cvv" className="form-label">
              {t(`${prefix}.cvv`)}
            </ThemeModes>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              className={`form-input ${errors.cvv ? "input-error" : ""}`}
              maxLength="4"
            />
            {errors.cvv && <p className="error-text">{errors.cvv}</p>}
          </div>
        </div>
        <button type="submit" className="submit-button">
          {t(`${prefix}.submit`)}
        </button>
      </form>
    </ThemeModes>
  );
};

export default PaymentPage;
