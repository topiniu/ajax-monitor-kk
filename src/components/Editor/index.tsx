import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Select, Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import * as monaco from 'monaco-editor';
import './index.less';

const MonacoEditor = React.forwardRef((props: any, ref) => {
  const {
    languageSelectOptions = ['json', 'javascript'],
    examples = [{ egTitle: '', egText: '// Type here' }],
    language: initialLanguage = 'javascript',
    defaultValue = '',
    onEditorChange,
  } = props;

  const editorRef = useRef(null);
  const containerRef = useRef(null);
  // const [editor, setEditor] = useState(null);
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);

  const [language, setLanguage] = useState(initialLanguage);
  const [dropVisible, setDropVisible] = useState(true);

  useImperativeHandle(ref, () => ({
    editorInstance: editor,
  }));

  useEffect(() => {
    if (!editor && editorRef.current) {
      monaco.languages.register({ id: 'text' });
      const newEditor:any = monaco.editor.create(editorRef.current, {
        value: '',
        language,
        theme: 'vs-dark',
        scrollBeyondLastLine: false,
        tabSize: 2,
        minimap: { enabled: false },
      });

      newEditor.onDidChangeModelContent(() => {
        const newValue = newEditor.getValue();
        onEditorChange?.(newValue);
      });

      const resizeObserver = new ResizeObserver(() => {
        newEditor.layout();
      });

      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      setEditor(newEditor);

      return () => {
        resizeObserver.disconnect();
        newEditor.dispose();
      };
    }
  }, []);

  useEffect(() => {
    if (editor) {
      editor?.getModel()?.setValue(props.defaultValue || '');
      setTimeout(() => {
        formatDocumentAction();
      }, 300);
    }
  }, [editor, props.defaultValue]);

  const formatDocumentAction = () => {
    editor?.getAction('editor.action.formatDocument')?.run();
  };

  const onLanguageChange = (_language) => {
    if (editor) {
      setLanguage(_language);
      monaco.editor.setModelLanguage(editor.getModel()!, _language);
    }
  };

  const onAddExampleClick = (eg) => {
    if (editor) {
      const { egText, egLanguage = 'javascript' } = eg;
      editor.getModel()?.setValue(egText);
      if (egLanguage !== language) setLanguage(egLanguage);
      monaco.editor.setModelLanguage(editor.getModel()!, egLanguage);
    }
  };

  const menu = (
    <Menu>
      {examples.map((eg, index) => (
        <Menu.Item key={index}>
          <div onClick={() => onAddExampleClick(eg)}>{eg.egTitle}</div>
        </Menu.Item>
      ))}
    </Menu>
  );

  const visibleTimeout = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    visibleTimeout.current = setTimeout(() => {
      handleVisibleChange(false);
    }, 800);
    return () => {
      if (visibleTimeout.current) {
        clearTimeout(visibleTimeout.current);
        visibleTimeout.current = null;
      }
    };
  }, []);
  const handleVisibleChange = (newVal) => {
    if (visibleTimeout.current) {
      clearTimeout(visibleTimeout.current);
      visibleTimeout.current = null;
    }
    setDropVisible(newVal);
  };

  return (
    <div className="monaco-editor-container" id="monaco-editor-container" ref={containerRef}>
      <div className="monaco-editor-header">
        <Select
          size="small"
          value={language}
          onChange={onLanguageChange}
          className="language-select"
        >
          {languageSelectOptions.map((lang) => (
            <Select.Option key={lang} value={lang}>
              {lang}
            </Select.Option>
          ))}
        </Select>
        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
          {examples.length > 1 ? (
            <Dropdown
              overlay={menu}
              visible={dropVisible}
              trigger={['click', 'hover']}
              onVisibleChange={handleVisibleChange}
            >
              <a onClick={(e) => e.preventDefault()}>
                <div className="border-button">
                  <span>Example</span>
                  <DownOutlined className="down-icon" />
                </div>
              </a>
            </Dropdown>
          ) : (
            <div
              className="border-button"
              onClick={() => onAddExampleClick(examples[0])}
            >
              <span>Example</span>
            </div>
          )}

          <div className="border-button" onClick={formatDocumentAction}>
            <span>Format</span>
          </div>
        </div>
      </div>
      <div
        ref={editorRef}
        style={{
          height: 400,
          minHeight: 100,
          width: '100%',
        }}
      />
    </div>
  );
});

export default React.memo(MonacoEditor);