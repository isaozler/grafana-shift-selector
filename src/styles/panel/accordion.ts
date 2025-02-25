// import { styled } from "@stitches/react"
import { useStitchesTheme } from '../../components/themeProvider';

export const AccordionComponent = () => {
  const { styled, theme } = useStitchesTheme();

  if (!styled) {
    return {
      Input: () => null,
      Header: () => null,
      Handler: () => null,
      Title: () => null,
      Body: () => null,
      Container: () => null,
    };
  }

  const Header = styled('div', {
    display: 'flex',
    cursor: 'pointer',
    boxAlign: 'center',
    alignItems: 'center',
    padding: 4,
    color: '$themeText',
    fontWeight: 500,
    '&:hover': {
      background: theme.v1.bg2,
    },
  });

  const Handler = styled('button', {
    display: 'inline-flex',
    boxAlign: 'center',
    alignItems: 'center',
    fontSize: '12px',
    fontWeight: '500',
    fontFamily: 'Inter, Helvetica, Arial, sans-serif',
    padding: '0px 7px',
    height: '24px',
    lineHeight: '22px',
    verticalAlign: 'middle',
    cursor: 'pointer',
    borderRadius: '2px',
    background: 'transparent',
    color: theme.v1.text,
    border: '1px solid transparent',
    transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    alignSelf: 'baseline',
    letterSpacing: '0.01071em',
    touchAction: 'manipulation',
    margin: 0,
    '&:hover': {
      background: theme.v1.bg3,
      textDecoration: 'none',
    },
    '& > svg': {
      display: 'inline-block',
      fill: 'currentcolor',
      flexShrink: 0,
      lineHeight: 0,
      verticalAlign: 'middle',
      marginRight: -4,
      marginLeft: -4,
    },
    variants: {
      isActive: {
        true: {
          '& > svg': {
            transform: 'rotate(90deg)',
          },
        },
      },
    },
  });

  const Title = styled('h6', {
    boxFlex: 1,
    flexGrow: 1,
    overflow: 'hidden',
    lineHeight: 1.5,
    fontSize: '1rem',
    paddingLeft: 6,
    fontWeight: 500,
    margin: 0,
    userSelect: 'none',
    '& > span': {
      display: 'inline-block',
      backgroundColor: theme.v1.bg3,
      color: theme.v1.text,
      fontSize: '0.8rem',
      marginLeft: 8,
      fontWeight: 400,
      padding: '2px 4px',
      marginBottom: 2,
      textAlign: 'center',
      minWidth: 24,
      borderRadius: 2,
    },
  });

  const Body = styled('div', {
    padding: '8px 16px 8px 32px',
    display: 'none',
    variants: {
      isActive: {
        true: {
          display: 'block',
        },
      },
    },
  });

  const Container = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 16,
  });

  return {
    Header,
    Handler,
    Title,
    Body,
    Container,
  };
};
