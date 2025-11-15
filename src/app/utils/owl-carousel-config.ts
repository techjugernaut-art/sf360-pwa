import { OwlOptions } from 'ngx-owl-carousel-o';

export const owlCustomOptions: OwlOptions = {
  loop: true,
  mouseDrag: true,
  touchDrag: true,
  pullDrag: true,
  items: 1,
  dots: true,
  autoplay: false,
  navSpeed: 700,
  navText: ['PREVIOUS', 'NEXT'],
  animateOut: 'fxSoftScaleOutNext',
  animateIn: 'fxSoftScaleInNext',
  responsive: {
    600: {
      animateOut: 'fxSoftScaleOutNext',
      animateIn: 'fxSoftScaleInNext',
      dots: true,
    }
  },
  nav: true
};
