const getRandomNumberByRange = (start: number, end: number) => {
    return Math.round(Math.random() * (end - start) + start)
}

const getRandomImgSrc = (width: number, height: number): string => {
    return `https://picsum.photos/id/${getRandomNumberByRange(0, 1084)}/${width}/${height}`;
}

const randomImage = (width: number, height: number): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        let imgSrc = getRandomImgSrc(width, height);

        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = imgSrc;
        img.onload = () => {
            resolve(img);
        }
        img.onerror = (error) => {
            img.src = getRandomImgSrc(width, height);
        }
    })
}

export {
    randomImage,
    getRandomNumberByRange,
}