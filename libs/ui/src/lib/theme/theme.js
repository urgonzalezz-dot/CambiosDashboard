import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  typography: { button: { textTransform: 'none' } },
  palette: {
    primary: {
      main: '#833177',
      dark: '#481B41',
      '&.active': { color: '#F34', background: '#5D2354', border: '#833177' },
      textTransform: 'none',
    },
    text: { main: '#333' },
    action: { disabledBackground: '#D8D8D8', disabled: '#FFF' },
    selected: { main: '#5D2354', contrastText: '#FFF', dark: '#481B41' },
    secondary: { main: '#37ABC6', contrastText: '#FFF' },
    success: { main: '#0ABD3E', contrastText: '#FFF' },
    alert: { main: '#EC9E00' },
    disabled: { main: '#D8D8D8', contrastText: '#FFF' },
    error: { main: '#FF0000', contrastText: '#FFF', dark: '#B50000' },
    selectedError: { main: '#E80000', contrastText: '#FFF', dark: '#B50000' },
    gray: { main: '#666666' },
    grayed: { main: '#E6E6E6' },
    filter: { main: '#F3EAF1', contrastText: '#833177' },
    filterDelete: { main: '#FFE6E6', contrastText: '#B50000' },
    errorTag: { main: '#FFE6E6', contrastText: '#FF0000' },
    secondaryTag: { main: '#EBF7F9', contrastText: '#37ABC6' },
    primaryTag: { main: '#F3EAF1', contrastText: '#833177' },
    warningTag: { main: '#FDF5E6', contrastText: '#D79000' },
    successTag: { main: '#E7F8EC', contrastText: '#09AC38' },
    neutral: { main: '#EBEBEB', contrastText: '#333333' },
    warningTagStores: { main: '#FFF0E7', contrastText: '#FF6A13' },
    bgColor: { main: '#f5f5f5', contrastText: '#FFF' },
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: { backgroundColor: '#fff', color: '#333333' },
      },
    },
    LinkTab: { defaultProps: { textTransform: 'none' } },
    MuiTab: {
      styleOverrides: {
        root: { '&.Mui-selected': { color: '#333', fontWeight: '550' } },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { '&.MuiButton-outlined.Mui-disabled': { color: '#D8D8D8' } },
      },
      defaultProps: { disableElevation: true },
      variants: [
        {
          props: { variant: 'outlined', color: 'primary' },
          style: {
            border: 'solid 1px #833177',
            color: '#833177',
            background: '#FFF',
            '&:hover': {
              border: 'solid 1px #5D2354',
              color: '#5D2354',
              background: '#F3EAF1',
            },
          },
        },
        {
          props: { variant: 'outlined', color: 'selected' },
          style: {
            border: 'solid 1px #5D2354',
            background: '#E5D3E2',
            color: '#5D2354',
            '&:hover': { border: 'solid 1px #481B41', color: '#481B41' },
          },
        },
        {
          props: { variant: 'circulo', color: 'primary' },
          style: {
            background: '#833177',
            borderRadius: '50%',
            minWidth: '10px',
            padding: '9px',
            margin: '1px',
            '&:hover': { background: '#481B41' },
          },
        },
        {
          props: { variant: 'circulo', color: 'selected' },
          style: {
            background: '#5D2354',
            borderRadius: '50%',
            minWidth: '10px',
            padding: '9px',
            margin: '1px',
            '&:hover': { background: '#481B41' },
          },
        },
        {
          props: { variant: 'square', color: 'primary' },
          style: {
            background: '#833177',
            borderRadius: '4px',
            minWidth: '10px',
            padding: '10px',
            '&:hover': { background: '#481B41' },
          },
        },
        {
          props: { variant: 'square', color: 'selected' },
          style: {
            background: '#5D2354',
            borderRadius: '75%',
            minWidth: '10px',
            padding: '8px',
          },
        },
        {
          props: { variant: 'outlinedSquare', color: 'primary' },
          style: {
            borderRadius: '4px',
            minWidth: '10px',
            padding: '10px',
            background: '#FFF',
            border: '1px solid #FF0000',
            '&:hover': { background: '#FFE6E6', border: '1px solid #B50000' },
          },
        },
        {
          props: { variant: 'outlined', color: 'error' },
          style: {
            border: '1px solid #FF0000',
            '&:hover': {
              border: '1px solid #B50000',
              background: '#FFE6E6',
              color: '#B50000',
            },
          },
        },
        {
          props: { variant: 'outlined', color: 'selectedError' },
          style: {
            border: '1px solid #FF0000',
            background: '#FFE6E6',
            color: '#FF0000',
            '&:hover': {
              background: '#FFE6E6',
              border: '1px solid #B50000',
              color: '#B50000',
            },
          },
        },
        {
          props: { size: 'large' },
          style: { height: '48px', padding: '0.75rem, 2rem, 0.75rem, 2rem' },
        },
        {
          props: { size: 'medium' },
          style: { height: '40px', padding: '10px, 2rem, 10px, 2rem' },
        },
        {
          props: { size: 'small' },
          style: { height: '2rem', padding: '4px, 2rem, 4px, 2rem' },
        },
        {
          props: { size: 'extra small' },
          style: { height: '1.5rem', padding: '4px, 2rem, 4px, 2rem' },
        },
        {
          props: { variant: 'underline', color: 'primary' },
          style: {
            border: 'none',
            textDecorationLine: 'underline',
            textDecorationColor: '#833177',
            background: 'none',
            color: '#833177',
            '&:hover': {
              textDecorationLine: 'underline',
              textDecorationColor: '#481B41',
              color: '#481B41',
              background: 'none',
            },
          },
        },
        {
          props: { variant: 'underline', color: 'selected' },
          style: {
            border: 'none',
            textDecorationLine: 'underline',
            textDecorationColor: '#5D2354',
            background: 'none',
            color: '#5D2354',
            '&:hover': {
              textDecorationLine: 'underline',
              textDecorationColor: '#481B41',
              color: '#481B41',
              background: 'none',
            },
          },
        },
        {
          props: { variant: 'underline' },
          style: {
            ':disabled': {
              color: '#D8D8D8',
              textDecorationLine: 'underline',
              textDecorationColor: '#D8D8D8',
            },
          },
        },
      ],
    },
    MuiIconButton: {
      styleOverrides: { root: { '&.Mui-disabled': { color: '#D8D8D8' } } },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          margin: '0 !important',
          '& .MuiInputLabel-asterisk': { color: 'red' },
          '& .MuiFormLabel-asterisk': { color: 'red' },
        },
      },
      variants: [
        {
          props: { variant: 'outlined', color: 'steady' },
          style: {
            '&:hover $textFieldNotchedOutline': {
              border: '1px solid #481B41',
              color: '#481B41',
            },
            '& .MuiOutlinedInput-root:hover': {
              '& fieldset': { border: '2px solid #481B41', color: '#481B41' },
              color: '#481B41',
            },
            '& .MuiTextField-root:hover': { '& label': { color: '#481B41' } },
            '& .MuiFormLabel-root': { color: '#481B41' },
          },
        },
        {
          props: { disabled: true },
          style: {
            '& .MuiOutlinedInput-root': {
              '& fieldset.MuiOutlinedInput-notchedOutline': {
                border: '1px solid #D8D8D8',
              },
            },
            color: '#D8D8D8',
          },
        },
      ],
    },
    MuiAlert: {
      styleOverrides: {
        standardSuccess: {
          borderLeft: '6px solid #0ABD3E',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
        },
        standardInfo: {
          borderLeft: '6px solid #37ABC6',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
        },
        standardWarning: {
          borderLeft: '6px solid #EC9E00',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
        },
        standardError: {
          borderLeft: '6px solid #E80000',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
        },
      },
      props: { variant: 'outlined', color: 'success' },
      style: {
        '& .MuiAlert-root': { display: 'flex', alignItems: 'center' },
        '& .MuiAlert-message': {
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        },
        '& .MuiPaper-root': {
          display: 'flex',
          alignItems: 'center',
          borderLeft: `6px solid #0ABD3E`,
        },
      },
    },
    MuiChip: {
      defaultProps: { borderRadius: '3px' },
      variants: [
        {
          props: { variant: 'contained', color: 'filter' },
          style: { background: '#F3EAF1', color: '#833177', height: '1.5rem' },
        },
        {
          props: { variant: 'contained', color: 'filterDelete' },
          style: { background: '#FFE6E6', color: '#B50000', height: '1.5rem' },
        },
        {
          props: { variant: 'contained', color: 'secondaryTag' },
          style: { background: '#EBF7F9', border: 'none', color: '#37ABC6' },
        },
        {
          props: { variant: 'contained', color: 'errorTag' },
          style: { background: '#FFE6E6', border: 'none', color: '#FF0000' },
        },
        {
          props: { variant: 'contained', color: 'warningTag' },
          style: { background: '#FDF5E6', border: 'none', color: '#D79000' },
        },
        {
          props: { variant: 'contained', color: 'successTag' },
          style: { background: '#E7F8EC', border: 'none', color: '#09AC38' },
        },
        {
          props: { variant: 'contained', color: 'primaryTag' },
          style: { background: '#F3EAF1', border: 'none', color: '#833177' },
        },
        {
          props: { variant: 'outlined', color: 'filter' },
          style: { background: '#F3EAF1', color: '#833177', height: '1.5rem' },
        },
        {
          props: { variant: 'outlined', color: 'filterDelete' },
          style: {
            background: '#FFF',
            color: '#B50000',
            border: '1px solid #B50000',
            height: '1.5rem',
          },
        },
        {
          props: { variant: 'outlined', color: 'secondaryTag' },
          style: {
            background: '#FFF',
            color: '#37ABC6',
            border: '1px solid #37ABC6',
          },
        },
        {
          props: { variant: 'outlined', color: 'successTag' },
          style: {
            background: '#FFF',
            border: '1px solid #09AC38',
            color: '#09AC38',
          },
        },
        {
          props: { variant: 'outlined', color: 'errorTag' },
          style: {
            background: '#FFF',
            border: '1px solid #FF0000',
            color: '#FF0000',
          },
        },
        {
          props: { variant: 'outlined', color: 'warningTag' },
          style: {
            background: '#FFF',
            border: '1px solid #D79000',
            color: '#D79000',
          },
        },
        {
          props: { variant: 'outlined', color: 'primaryTag' },
          style: {
            background: '#FFF',
            border: '1px solid #833177',
            color: '#833177',
          },
        },
        {
          props: { variant: 'outlined', color: 'neutral' },
          style: {
            background: '#FFF',
            border: '1px solid #333333',
            color: '#333333',
          },
        },
      ],
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&.MuiMenuItem-divider': {
            width: 'auto',
            display: 'flex',
            gap: '0.5rem',
            borderBottom: '1px solid #F5F5F5',
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          '&.Mui-disabled.Mui-checked span': {
            backgroundColor: '#CFB0CB',
            boxShadow: 'inset 0 0 0 1px #CFB0CB, inset 0 -1px 0 #CFB0CB',
          },
        },
      },
    },
    MuiInputLabel: { styleOverrides: { asterisk: { color: 'red' } } },
    MuiCheckbox: {
      styleOverrides: {
        root: { '&.Mui-disabled': { color: 'rgb(0 0 0 / 26%)' } },
      },
    },
    MuiFormGroup: { styleOverrides: { root: { marginBottom: '0.8rem' } } },
    MuiFormHelperText: {
      styleOverrides: { root: { margin: '0', lineHeight: 1.3 } },
    },
  },
});
