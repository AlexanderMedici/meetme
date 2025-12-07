const FormContainer = ({ children }) => {
  return (
    <div className="form-container">
      <div className="form-inner">{children}</div>
    </div>
  );
};

export default FormContainer;
