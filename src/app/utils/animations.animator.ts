import { trigger, state, style, transition, animate, query, keyframes, stagger } from '@angular/animations';

export const collapsibleMenuAnimation = [
  trigger('indicatorRotate', [
    state('collapsed', style({ transform: 'rotate(0deg)' })),
    state('expanded', style({ transform: 'rotate(180deg)' })),
    transition('expanded <=> collapsed',
      animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
    ),
  ])
];
export const inOutAnimation = trigger('inOutAnimation', [
  state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
  state('expanded', style({height: '*'})),
  transition('expanded <=> collapsed', animate('225ms cubic-bezier(.17,.67,.72,.95)')),
]);
export const collapsibleInOutAnimation = trigger(
  'collapsibleInOutAnimation',
  [
    transition(
      ':enter',
      [
        style({ height: 0, opacity: 0 }),
        animate('1s ease-out',
                style({ height: 300, opacity: 1 }))
      ]
    ),
    transition(
      ':leave',
      [
        style({ height: 300, opacity: 1 }),
        animate('1s ease-in',
                style({ height: 0, opacity: 0 }))
      ]
    )
  ]
);
export const inAnimation = trigger(
  'inAnimation',
  [
    transition(
      ':enter',
      [
        style({ height: 0, opacity: 0 }),
        animate('1s ease-out',
                style({ height: 300, opacity: 1 }))
      ]
    )
  ]
);
export const outAnimation = trigger(
  'outAnimation',
  [
    transition(
      ':leave',
      [
        style({ height: 300, opacity: 1 }),
        animate('1s ease-in',
                style({ height: 0, opacity: 0 }))
      ]
    )
  ]
);
export const fadeInOutAnimation =  trigger(
  'fadeInOutAnimation',
  [
    transition(
      ':enter',
      [
        style({ height: '0px', opacity: 0 }),
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)',
                style({ height: '*', opacity: 1 }))
      ]
    ),
    transition(
      ':leave',
      [
        style({ height: '*', opacity: 1 }),
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)',
                style({ height: '0px', opacity: 0 }))
      ]
    )
  ]
);

export const fader = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        left: 0,
        width: '100%',
        opacity: 0,
        transform: 'scale(0) translateY(100%)'
      }),
      query(':enter', [
        animate('600ms ease',
        style({
          opacity: 0,
          transform: 'scale(1)'
        }))
      ])
    ])
  ])
]);

export const speedDialFabAnimations = [
  trigger('fabToggler', [
    state('inactive', style({
      transform: 'rotate(0deg)'
    })),
    state('active', style({
      transform: 'rotate(225deg)'
    })),
    transition('* <=> *', animate('200ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
  ]),
  trigger('speedDialStagger', [
    transition('* => *', [

      query(':enter', style({ opacity: 0 }), {optional: true}),

      query(':enter', stagger('40ms',
        [
          animate('200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
            keyframes(
              [
                style({opacity: 0, transform: 'translateY(10px)'}),
                style({opacity: 1, transform: 'translateY(0)'}),
              ]
            )
          )
        ]
      ), {optional: true}),

      query(':leave',
        animate('200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          keyframes([
            style({opacity: 1}),
            style({opacity: 0}),
          ])
        ), {optional: true}
      )

    ])
  ])
];
