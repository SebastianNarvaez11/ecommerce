import { FC } from 'react';
import { Slide } from 'react-slideshow-image';

import 'react-slideshow-image/dist/styles.css'

import styles from '../../styles/ProductSliceshow.module.css'

interface Props {
    images: string[]
}

export const ProductSlidesshow: FC<Props> = ({ images }) => {
    return (
        <Slide
            easing='ease'
            duration={5000}
            indicators>

            {images.map(image => {
                return (
                    <div className={styles['each-slide']} key={image}>
                        <div style={{ backgroundImage: `url(${ image })`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}></div>
                    </div>
                )
            })}
        </Slide>
    )
}
