import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import imagen1 from '../Static/Banner_Ferremax_Mesa-de-trabajo-1.jpg';
import imagen2 from '../Static/Banner_Ferremax_Mesa-de-trabajo-2.jpg';

const index = () => {
    return (
        <div>
            <Carousel>
                 <div>
                    <img src={imagen1}/>
                </div>
                <div>
                    <img src={imagen2}/>
                </div>
            </Carousel>
        </div>
    );
}

export default index;