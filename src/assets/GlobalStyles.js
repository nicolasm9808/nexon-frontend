import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => (props.darkMode ? '#121212' : '#ffffff')};
    color: ${(props) => (props.darkMode ? '#ffffff' : '#000000')};
  }
`;
