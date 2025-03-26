import { notifyError } from "../components/admin/comman/notification/Notification";

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
        animation: 'slideIn 0.5s ease-in-out forwards',
        '&::-webkit-scrollbar': {
            display: 'none',
        },
        scrollbarWidth: 'none',
    }),
};

export const fetchSelectedOptions = (data) => {
    const Options = data?.map((val, index) => ({
        value: val?.id,
        label: `${ucwords(val?.name)}`
    }));
    return Options;
}

export const getFullName = (name) => {
    return `${name?.first_name} ${name?.middle_name ? name?.middle_name + ' ' : ''}${name?.last_name}`;
}

export const dummyImage = () => {
    return `./../../public/admin/img/profile-img.jpg`;
}

export const handleErrorImage = (event, defaultImage) => {
    return event.target.src = defaultImage ?? dummyImage();
};

export const loremPatterns = [
    /lorem ipsum/i,  // Match "Lorem ipsum" (case insensitive)
    /dolor sit amet/i,  // Match "dolor sit amet"
    /consectetur adipiscing elit/i,  // Match "consectetur adipiscing elit"
    /sed do eiusmod tempor incididunt/i,  // Match "sed do eiusmod tempor incididunt"
    /ut labore et dolore magna aliqua/i,  // Match "ut labore et dolore magna aliqua"
    /quis nostrud exercitation ullamco/i,  // Match "quis nostrud exercitation ullamco"
    /labore et dolore magna aliqua/i,  // Match "labore et dolore magna aliqua"
];

export const loremTextCheck = (text) => {
    return loremPatterns.some((pattern) => pattern.test(text));

    // if (isLorem) {
    //     return res.status(400).json({ error: 'Error: Please do not use Lorem Ipsum text.' });
    // }
}