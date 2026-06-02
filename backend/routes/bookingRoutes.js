const express = require('express');
const {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
  bulkInsertBookings,
  deleteAllBookings,
} = require('../controllers/bookingController');

const {
  getByBookingId,
  getByStatus,
  getByCustomer,
  getByVehicleType,
  getByPaymentMethod,
  getByPickupLocation,
  getByDropLocation,
  getByDate,
  getByTime,
  getByDriverRating,
  getByCustomerRating,
  getByDistance,
  getByValue,
  getByIncompleteStatus,
  getByIncompleteReason,
  getByCancelCustomer,
  getByCancelDriver,
  getByVtat,
  getByCtat,
  getByDay,
  getByMonth,
  getByYear,
  getByHour,
  getByMinute,
  getBySource,
  getByDestination,
  getByVehicleImage,
  getByFare,
  getCustomerHistory,
  getCustomerLatest,
} = require('../controllers/filterController');

const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.route('/').get(getBookings).post(createBooking);
router.post('/bulk-insert', bulkInsertBookings);
router.delete('/delete-all', deleteAllBookings);
router.route('/:bookingId/status').patch(updateBookingStatus);
router.route('/:bookingId').get(getBookingById).put(updateBooking).delete(deleteBooking);

router.get('/id/:bookingId',          getByBookingId);       
router.get('/status/:status',         getByStatus);          
router.get('/customer/:customerId',   getByCustomer);        
router.get('/vehicle/:vehicleType',   getByVehicleType);     
router.get('/payment/:method',        getByPaymentMethod);   
router.get('/pickup/:location',       getByPickupLocation);  
router.get('/drop/:location',         getByDropLocation);    
router.get('/date/:date',             getByDate);            
router.get('/time/:time',             getByTime);            
router.get('/rating/driver/:rating',  getByDriverRating);    

router.get('/rating/customer/:rating',    getByCustomerRating);    
router.get('/distance/:distance',         getByDistance);          
router.get('/value/:amount',              getByValue);             
router.get('/incomplete/:status',         getByIncompleteStatus);  
router.get('/incomplete-reason/:reason',  getByIncompleteReason);  
router.get('/cancel/customer/:reason',    getByCancelCustomer);    
router.get('/cancel/driver/:reason',      getByCancelDriver);      
router.get('/vtat/:minutes',              getByVtat);              
router.get('/ctat/:minutes',              getByCtat);              
router.get('/day/:day',                   getByDay);               

router.get('/month/:month',                      getByMonth);          
router.get('/year/:year',                        getByYear);           
router.get('/hour/:hour',                        getByHour);           
router.get('/minute/:minute',                    getByMinute);         
router.get('/source/:pickup',                    getBySource);         
router.get('/destination/:drop',                 getByDestination);    
router.get('/vehicle-image/:imageName',          getByVehicleImage);   
router.get('/fare/:value',                       getByFare);           
router.get('/customer/:customerId/history',      getCustomerHistory);  
router.get('/customer/:customerId/latest',       getCustomerLatest);   

module.exports = router;
