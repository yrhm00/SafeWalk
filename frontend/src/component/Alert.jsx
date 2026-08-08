import PropTypes from 'prop-types';

function Alert({ type = 'info', message }) {
  if (!message) return null;
  return <div className={`alert alert-${type}`}>{message}</div>;
}

Alert.propTypes = {
  type: PropTypes.oneOf(['info', 'error']),
  message: PropTypes.string,
};

export default Alert;

