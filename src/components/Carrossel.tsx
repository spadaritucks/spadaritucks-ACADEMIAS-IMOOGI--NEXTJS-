'use client'; // Adicione esta linha
import Carousel from 'react-bootstrap/Carousel';
import Image from 'next/image'; // Importando o componente Image do Next.js
import Image01 from '../../public/background-2.png'; // Importando a imagem
import Image02 from '../../public/background-1.png'; // Importando a imagem


function Carrosel() {
  return (
    <Carousel>
      <Carousel.Item>
        <Image 
          src={Image01} // Usando o componente Image
          alt="First slide" 
          layout="responsive" // Usar layout adequado
          style={{width: '100%', height: 'auto'}} // Defina a largura
         // Defina a altura
        />

      </Carousel.Item>
      <Carousel.Item>
        <Image 
          src={Image02} // Pode usar imagens diferentes aqui
          alt="Second slide" 
          layout="responsive"
          style={{width: '100%', height: 'auto'}} // Defina a largura
        />

      </Carousel.Item>



    </Carousel>
  );
}

export default Carrosel;
