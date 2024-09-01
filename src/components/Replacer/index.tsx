import React, { useState, useEffect } from 'react'
import { Switch, Radio } from 'antd'
import MonacoEditor from '../Editor/index'
import {
  REQUEST_PAYLOAD_EXAMPLES,
  HEADERS_EXAMPLES,
  RESPONSE_EXAMPLES,
  RESPONSE_SIMPLE_EXAMPLES
} from '../Editor/examples'

import './index.less'

const setChromeStorage = (key, value) => {
  // 发送给background.js
  chrome.runtime.sendMessage(chrome.runtime.id, { type: 'ajaxInterceptor', to: 'background', key, value })
  chrome.storage && chrome.storage.local.set({ [key]: value })
}

interface ReplacerProps {
  updateAddBtnTop_interval: () => void;
  ruleId: string;
  set: (key: string, value: any) => void;
  rule: AjaxInterceptorRule;
  rules: AjaxInterceptorRule[];
}

const Replacer: React.FC<ReplacerProps> = ({ updateAddBtnTop_interval, ruleId, set, rule, rules }) => {
  const [showJSONEditor, setShowJSONEditor] = useState(false)
  const [editorValue, setEditorValue] = useState(rule.editorValue || 3)
  const [isExpert, setIsExpert] = useState(rule.isExpert || false)

  useEffect(() => {
    updateAddBtnTop_interval()
  }, [showJSONEditor, updateAddBtnTop_interval])

  const updateRule = (updatedFields: Partial<AjaxInterceptorRule>) => {
    const ruleIndex = rules.findIndex(rule => rule.id === ruleId);
    if (ruleIndex !== -1) {
      rules[ruleIndex] = {
        ...rules[ruleIndex],
        ...updatedFields
      };
      set('ajaxInterceptor_rules', rules);
    }
  };

  const handleOverrideTxtChange = (txt) => {
    updateRule({ overrideTxt: txt })
  }

  const handleExpertSwitch = () => {
    const newIsExpert = !isExpert
    setIsExpert(newIsExpert)
    updateRule({ isExpert: newIsExpert })
    setChromeStorage('ajaxInterceptor_rules', rules)
    updateAddBtnTop_interval()
  }

  const handleEditorRatioChange = (e) => {
    const newEditorValue = e.target.value;
    setEditorValue(newEditorValue);
    updateRule({ editorValue: newEditorValue });
  }

  const onPayloadEditorChange = (newValue) => {
    updateRule({ overridePayloadFunc: newValue })
  }

  const onHeadersEditorChange = (newValue) => {
    updateRule({ overrideHeadersFunc: newValue })
  }

  const onResponseEditorChange = (newValue) => {
    updateRule({ overrideResponseFunc: newValue })
  }

  return (
    <>
      <Switch onChange={handleExpertSwitch} size="small" checked={isExpert}
              checkedChildren=" Advanced Mode" unCheckedChildren="Advanced Mode " />
      {!isExpert && (
        <div>
          <div className="replace-with">
            Replace Response With:
          </div>
          <MonacoEditor
            index={ruleId}
            language="json"
            defaultValue={rule.overrideTxt}
            examples={RESPONSE_SIMPLE_EXAMPLES}
            onEditorChange={handleOverrideTxtChange}
            languageSelectOptions={["json", "text"]}
          />
        </div>
      )}
      {isExpert && (
        <div>
          <Radio.Group value={editorValue} onChange={handleEditorRatioChange} className="replace-radio">
            <Radio.Button value={1}>Payload</Radio.Button>
            <Radio.Button value={2}>Headers</Radio.Button>
            <Radio.Button value={3}>Response</Radio.Button>
          </Radio.Group>
          {editorValue === 1 && (
            <MonacoEditor
              index={ruleId}
              language="javascript"
              defaultValue={rule.overridePayloadFunc}
              examples={REQUEST_PAYLOAD_EXAMPLES}
              onEditorChange={onPayloadEditorChange}
              languageSelectOptions={["javascript"]}
            />
          )}
          {editorValue === 2 && (
            <MonacoEditor
              index={ruleId}
              language="javascript"
              defaultValue={rule.overrideHeadersFunc}
              examples={HEADERS_EXAMPLES}
              onEditorChange={onHeadersEditorChange}
              languageSelectOptions={["javascript"]}
            />
          )}
          {editorValue === 3 && (
            <MonacoEditor
              index={ruleId}
              language="javascript"
              defaultValue={rule.overrideResponseFunc}
              examples={RESPONSE_EXAMPLES}
              onEditorChange={onResponseEditorChange}
              languageSelectOptions={["javascript"]}
            />
          )}
        </div>
      )}
    </>
  )
}

export default Replacer