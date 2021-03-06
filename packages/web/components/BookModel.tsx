import React from 'react';
import Image from 'next/image';

interface Props {
  className?: string;
  modelClassName?: string;
  width?: number;
  cover?: string | null;
  flatten?: boolean;
}

export function BookModel({
  cover,
  className = '',
  modelClassName = '',
  flatten,
  width = 60
}: Props) {
  const ratio = width / 60;
  const thickness = 10 * ratio;

  return (
    <div className={`book-model-outer ${className}`.trim()}>
      <div
        className={['book-model', modelClassName, flatten ? 'flatten' : '']
          .join(' ')
          .trim()}
      >
        <div className="front">
          {cover && (
            <Image
              layout="fixed"
              alt="book cover"
              src={cover}
              width={width}
              height={(width * 4) / 3}
              draggable={false}
            />
          )}
        </div>
        <div className="back" />
        <div className="right" />
        <div className="left" />
        <div className="top" />
        <div className="bottom" />
      </div>
      <style jsx>
        {`
          .book-model-outer {
            position: relative;
            perspective: 1000px;
            margin-right: 15px;
            left: -5px;

            width: ${width}px;
            min-width: ${width}px;
            height: ${(width * 4) / 3}px;

            user-select: none;
          }

          .book-model {
            width: 100%;
            height: 100%;
            position: absolute;
            will-change: transform;
            transition: transform 0.4s ease;
            transform-style: preserve-3d;
            transform: rotateY(30deg) rotateX(12deg);

            &.flatten {
              transform: rotateY(0deg) rotateX(0deg);
            }

            .front {
              transform: rotateY(0deg) translateZ(${thickness / 2}px);
            }
            .back {
              transform: rotateX(180deg) translateZ(${thickness / 2}px);
            }
            .right {
              transform: rotateY(90deg) translateZ(${30 * ratio}px);
            }
            .left {
              transform: rotateY(-90deg) translateZ(${30 * ratio}px);
            }
            .top {
              transform: rotateX(90deg)
                translateZ(${Math.floor(37.5 * ratio)}px);
            }
            .bottom {
              transform: rotateX(-90deg)
                translateZ(${Math.floor(37.5 * ratio)}px);
            }

            .left,
            .right {
              width: ${thickness}px;
            }

            .top,
            .bottom {
              height: ${thickness}px;
            }

            .front,
            .bottom {
              background-color: var(--book-model-front-bottom-color);
            }

            .back {
              box-shadow: 0px -3px 8px -1px var(--book-model-shadow-color);
            }

            .left {
              background-color: var(--book-model-left-color);
              border: 1px solid var(--book-model-front-bottom-color);
              border-right: 0;
            }

            div {
              @include sq-dimen(100%);
              @include position(0, 0, 0, 0);

              margin: auto;

              background-size: cover;
              background-repeat: no-repeat;
              background-position: 0 0;
            }
          }
        `}
      </style>
    </div>
  );
}
