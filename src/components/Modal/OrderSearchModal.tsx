// import React, { useState, useCallback, ReactNode } from 'react';
// import BaseModal from '../BaseModals/BaseModal';
// import SearchContentModal from '../ContentModal/SearchContentModal';

// interface Country {
//     name: string;
//     code: string;
//     dialCode: string;
//     flag: string;
// }

// interface OrderSearchModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onSelectCountry: (country: Country) => void;
// }

// const OrderSearchModal: React.FC<OrderSearchModalProps> = ({
//     isOpen,
//     onClose,
//     onSelectCountry,
// }) => {
//     const [headerContent, setHeaderContent] = useState<ReactNode>(null);
//     const [footerContent, setFooterContent] = useState<ReactNode>(null);
//     const renderHeader = useCallback((content: ReactNode) => {
//         setHeaderContent(content);
//     }, []);

//     const renderFooter = useCallback((content: ReactNode) => {
//         setFooterContent(content);
//     }, []);

//     const toggleModal = () => onClose();

//     return (
//         <BaseModal
//             isOpen={isOpen}
//             toggle={toggleModal}
//             header={headerContent}
//             footer={footerContent}
//             widthClass="max-w-md md:max-w-lg"
//         >
//             <SearchContentModal
//                 onClose={onClose}
//                 onSelect={onSelectCountry}
//                 title="Search and Select Country"
//                 renderHeader={renderHeader}
//                 renderFooter={renderFooter}
//             />
//         </BaseModal>
//     );
// };

// export default OrderSearchModal;















import React, { useState, useCallback, ReactNode } from 'react';
import BaseModal from '../BaseModals/BaseModal';
import SearchContentModal from '../ContentModal/SearchContentModal';

interface Country {
    name: string;
    code: string;
    dialCode: string;
    flag: string;
}

interface OrderSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectCountry: (country: Country) => void;
}

const OrderSearchModal: React.FC<OrderSearchModalProps> = ({
    isOpen,
    onClose,
    onSelectCountry,
}) => {
    const [headerContent, setHeaderContent] = useState<ReactNode | null>(null);
    const [footerContent, setFooterContent] = useState<ReactNode | null>(null);

    const renderHeader = useCallback((content: ReactNode): void => {
        setHeaderContent(content);
    }, []);

    const renderFooter = useCallback((content: ReactNode): void => {
        setFooterContent(content);
    }, []);

    const toggleModal = (): void => onClose();

    return (
        <BaseModal
            isOpen={isOpen}
            toggle={toggleModal}
            header={headerContent}
            footer={footerContent}
            widthClass="max-w-md md:max-w-lg"
        >
            <SearchContentModal
                onClose={onClose}
                onSelect={onSelectCountry}
                title="Search and Select Country"
                renderHeader={renderHeader}
                renderFooter={renderFooter}
            />
        </BaseModal>
    );
};

export default OrderSearchModal;
