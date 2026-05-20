import React from 'react';

export default function CardWithImage({ imgSrc, title, description, link }) {
    return (
        <article>
            <img
                src={imgSrc}
            />
            <div class="content">
            <h2>{title}</h2>
            <p>
                {description}
            </p>
            </div>
        </article>
    )
}