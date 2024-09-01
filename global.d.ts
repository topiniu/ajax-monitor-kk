interface AjaxInterceptorRule {
    id: string,
    match: string;
    label: string;
    switchOn: boolean;
    key: string;
    filterType?: 'normal' | 'regex';
    limitMethod?: 'ALL' | 'GET' | 'POST' | 'PUT' | 'HEAD' | 'DELETE' | 'OPTIONS';
    tabId?: string;
    isExpert?: boolean;
    overrideTxt?: string;
    editorValue?: string;
    overridePayloadFunc?: any;
    overrideHeadersFunc?: any;
    overrideResponseFunc?: any;
    overrideErrorFunc?: any;
  }
  
interface Window {
    setting: {
      ajaxInterceptor_rules: AjaxInterceptorRule[];
      ajaxInterceptor_switchOn: boolean;
      customFunction: any;
    }
  }