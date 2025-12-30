import * as React from 'react';
import './_dashboardHeader.scss';

import AutorenewIcon from '@mui/icons-material/Autorenew';
import { Button } from '@libs/ui';

const DashboardHeaderCard = () => {
  return (
    <div className="dashboard-header-card">
      <div className="dashboard-header-card__content">
        <div className="dashboard-header-card__left">
          <h1 className="dashboard-header-card__greeting">¡Hola, Ulises!</h1>

          <div className="dashboard-header-card__dropdown">
            <select
              defaultValue="Entrada Única"
              className="dashboard-header-card__select"
            >
              <option value="Entrada Única">Entrada Única</option>
              <option value="Otra Entrada">Otra Entrada</option>
            </select>
          </div>
        </div>

        <div className="dashboard-header-card__right">
          <Button variant="primary" size="md" startIcon={<AutorenewIcon />}>
            Actualizar
          </Button>

          <div className="dashboard-header-card__metadata">
            <p>Último cambio: 02/12/2025 12:00:00 am</p>
            <p>Repositorio: Entrada única</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeaderCard;
