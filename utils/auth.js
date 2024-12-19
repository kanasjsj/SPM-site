// utils/auth.js
const gerarNRG = () => {
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numero = Math.floor(Math.random() * 100000000);
  const nrg = `${letras.charAt(Math.floor(Math.random() * letras.length))}${letras.charAt(Math.floor(Math.random() * letras.length))}-${numero.toString().padStart(6, '0')}-${Math.floor(Math.random() * 100)}`;
  return nrg;
};

export { gerarNRG };