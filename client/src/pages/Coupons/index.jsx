import { useDispatch, connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useNavigate, useParams } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import CouponsCard from './components/CouponsCard';
import { selectCouponsPageData } from './selectors';
import CreateNewCoupon from './components/CreateNewCoupons';
import PopupWindow from '@components/PopupWindow/Dialog';

import classes from './style.module.scss';
import { selectUserData } from '@containers/Client/selectors';
import { getUserDataDecrypt } from '@utils/allUtils';
import { deleteCoupon, getCouponsData } from './actions';

const Coupons = ({ couponDatas, userData }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isOpenCreateCoupon, setIsOpenCreateCoupon] = useState(false);

    const onCloseCreateCoupon = (isRefresh) => {
        if(isRefresh) {
            dispatch(getCouponsData());
        }
        setIsOpenCreateCoupon(false);
    }

    const onDeleteCoupon = (id) => {
        dispatch(deleteCoupon({id}, () => {
            dispatch(getCouponsData());
        }));
    };

    useEffect(() => {
        if(userData) {
            const user = getUserDataDecrypt(userData);

            if(user && user?.role === 'business') {
                return;
            }
        }
        navigate('/');
    }, [userData]);
    useEffect(() => {
        dispatch(getCouponsData());
    }, []);

    return (
        <div className={classes.mainContainer}>
            <h1 className={classes.title}><FormattedMessage id='coupons_title' /></h1>
            <div className={classes.topButtonContainer}>
                <button className={classes.button} onClick={() => setIsOpenCreateCoupon(true)}><FormattedMessage id='coupons_create_new' /></button>
            </div>
            {couponDatas?.length > 0 ?
                <div className={classes.dataContainer}>
                    {couponDatas?.map(coupon =>
                        <CouponsCard key={coupon?.id} data={coupon} onDelete={onDeleteCoupon} />
                    )}
                </div>
                :
                <div className={classes.emptyContainer}>
                    <FormattedMessage id='empty_data' />
                </div>
            }
            <PopupWindow open={isOpenCreateCoupon} onClose={() => onCloseCreateCoupon(false)}>
                <CreateNewCoupon onClose={onCloseCreateCoupon} />
            </PopupWindow>
        </div>
    );
};

Coupons.propTypes = {
    couponDatas: PropTypes.object,
    userData: PropTypes.string
}

const mapStateToProps = createStructuredSelector({
    couponDatas: selectCouponsPageData,
    userData: selectUserData
});

export default connect(mapStateToProps)(Coupons);