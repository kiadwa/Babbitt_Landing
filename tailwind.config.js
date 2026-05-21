/** @type {import('tailwindcss').Config} */
export default {
    content: ['./demo/index.html'],
    theme: {
        extend: {
            colors: {
                yellow: '#F6B500',
                blue: '#60CDE2',
                green: '#67E4AA',
                orange: '#FF5C00',
                body: '#131210',
                surface: '#1C1A17',
                overlay: '#1A1815',
                elevated: '#242119',
                'elevated-2': '#2C2924',
                input: '#171512',
                txt: '#F0EDE8',
                'txt-secondary': '#9B9793',
                'txt-tertiary': '#5C5955',
                'txt-disabled': '#3A3835',
                'txt-inverse': '#131210',
                bdr: '#2E2B26',
                'bdr-subtle': '#222019',
                'bdr-strong': '#3D3A34',
            },
            fontFamily: {
                head: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
                body: ['Outfit', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                card: '20px',
                btn: '6px',
                badge: '4px',
                input: '8px',
                modal: '16px',
            },
            boxShadow: {
                'card-hover': '0 4px 24px rgba(0,0,0,0.40), 0 1px 6px rgba(0,0,0,0.25)',
                modal: '0 8px 48px rgba(0,0,0,0.60), 0 2px 12px rgba(0,0,0,0.30)',
                focus: '0 0 0 2px rgba(246,181,0,0.50)',
            },
        },
    },
    plugins: [],
};
