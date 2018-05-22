const TEST_HOST = "https://face.jd.com",//测试接口
  PROD_HOST = "https://mobile-test.jd.com";//线上接口

let isTest = true,
  host = isTest ? TEST_HOST : PROD_HOST,
  api = {
    "need_affirm_device_remark": host + "/api/platform/device/need_affirm_device_remark.ajax",
    "addDevice": host +"/api/platform/device/affirm_device_bind.ajax",
    "dataBoard": host+"/api/xiaochengxu/retailpanel/dataBoard_index.ajax",
    "FlowStatis":
     host +"/api/xiaochengxu/retailpanel/customer_flow_analysis.ajax",
    "CustomerStatis":
     host +"/api/xiaochengxu/retailpanel/customer_analysis.ajax",
    "hot_zone":host+"/api/xiaochengxu/retailpanel/hot_zone_analysis.ajax"
  }

 
export default api