import { useState } from 'react';
import { Link, Check } from 'lucide-react';

const SectionLink = ({ id, className = "" }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const url = `${window.location.origin}/${id ? `#${id}` : ''}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className={`inline-flex items-center justify-center p-2 rounded-full transition-all duration-300 group/link ${className} ${copied ? 'bg-green-500/20 text-green-500' : 'hover:bg-white/10 text-gray-500 hover:text-white'}`}
            title="Copiar enlace directo a esta sección"
        >
            {copied ? <Check size={20} /> : <Link size={20} className="opacity-50 group-hover/link:opacity-100" />}
        </button>
    );
};

export default SectionLink;
