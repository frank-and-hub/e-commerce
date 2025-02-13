import { notifyError } from "../components/Admin/Comman/Notification/Notification";

export const ucwords = (text) => {
    if (typeof text !== 'string' || text.length === 0) {
        return text;
    }

    return text.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export const lowercase = (text) => {
    if (typeof text !== 'string' || text.length === 0) {
        return text;
    }

    return text
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toLowerCase() + word.slice(1))
        .join(' ');
};

export const rasc = (text) => {
    if (text) {
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>-]/g;
        return text.replace(specialCharsRegex, '');
    }
}

export const formattedData = (formData) => {
    return Object.entries(formData).map(([key, value]) => ({
        propName: key,
        value: value
    }));
};

export const generateRandomString = () => {
    const length = Math.floor(Math.random() * (16 - 8 + 1)) + 8;
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let generatedString = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        generatedString += charset[randomIndex];
    }

    return generatedString;
};

export const truncateString = (str, maxLength = 25) => {
    if (str && str.length > maxLength) {
        return `${str.slice(0, maxLength)}...`;
    }
    return str;
}

export const checkFileValidation = async (e) => {
    const file = e?.target?.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB limit

    if (!file) {
        notifyError('No file selected.');
        return false;
    }

    if (file.size > maxSize) {
        notifyError('File size exceeds the maximum limit of 5MB');
        return false;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/svg', 'image/web'];
    if (!allowedTypes.includes(file.type)) {
        notifyError('Invalid file type. Only JPEG and PNG are allowed.');
        return false;
    }

    return true;
};

export const transformData = (data) => {
    const transformed = {};

    Object.keys(data).forEach((key) => {
        const match = key.match(/^(\w+)\[(\d+)\]$/);

        if (match) {
            const field = match[1];
            const index = parseInt(match[2]);

            if (!transformed[field]) transformed[field] = [];

            transformed[field][index] = data[key];
        } else {
            transformed[key] = data[key];
        }
    });

    return transformed;
};

export const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

export const loadCSS = (url) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
};

export const loadScript = (url) => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    document.body.appendChild(script);
};

export const customStyles = {
    control: (provided, state) => ({
        ...provided,
        borderRadius: `var(--bs-border-radius)`,
        boxShadow: state.isFocused ? `var(--background)` : `none`,
    }),
    option: (provided, state) => ({
        ...provided,
        textAlign: `left`,
        color: state.isSelected ? `var(--white)` : `var(--light)`,
        '& i': {
            color: state.isSelected ? `var(--white)` : `var(--light)`,
        }
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: `var(--light)`,
    }),
    clearIndicator: (provided) => ({
        ...provided,
        color: `var(--light)`,
    }),
    menuList: (provided) => ({
        ...provided,
        '&::-webkit-scrollbar': {
            display: 'none',
        },
        scrollbarWidth: 'none',
    }),
};