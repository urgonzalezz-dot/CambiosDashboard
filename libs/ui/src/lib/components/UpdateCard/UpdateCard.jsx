import { memo } from 'react';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { Button } from '../Button/Button';
import Styles from './UpdateCard.module.scss';

const UpdateCardComponent = ({
  lastUpdate = '02/12/2025 12:00:00 am',
  repository = 'Entrada única',
  onRefresh,
  buttonText = 'Actualizar',
}) => {
  return (
    <section className={Styles.card}>
      <div className={Styles.info}>
        <p className={Styles.line}>
          Último actualización: <span>{lastUpdate}</span>
        </p>
        <p className={Styles.line}>
          Repositorio: <span>{repository}</span>
        </p>
      </div>

      <div className={Styles.actions}>
        <Button
          variant="primary"
          size="md"
          startIcon={<AutorenewIcon />}
          onClick={onRefresh}
        >
          {buttonText}
        </Button>
      </div>
    </section>
  );
};

const UpdateCard = memo(UpdateCardComponent);

UpdateCard.displayName = 'UpdateCard';
export { UpdateCard };
