import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useReducer,
} from "react";
import { createRoot } from "react-dom/client";
import {
  Switch,
  Collapse,
  Input,
  Select,
  Button,
  Badge,
  Tooltip,
  Modal,
  Radio,
  Space,
  Tabs,
  Row,
  Col,
  Divider,
  message,
  Upload,
  Table,
  Drawer,
  Typography,
  Spin,
  Alert,
} from "antd";
import {
  MinusOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  ReloadOutlined,
  ExportOutlined,
  CopyOutlined,
  ToolFilled,
} from "@ant-design/icons";
import MonacoEditor from "./components/Editor/index";
import JSONPretty from "react-json-pretty";
import { FaFileExport, FaFileImport } from "react-icons/fa";
import { JsonEditor } from "json-edit-react";
import { BiSolidLock, BiSolidLockOpen } from "react-icons/bi";
import { AnimatePresence, motion } from "motion/react";
import { IconType } from "react-icons";
import { MdContentPaste } from "react-icons/md";
import { MdOutlineRefresh } from "react-icons/md";

const { Panel } = Collapse;
const { Option } = Select;

import Replacer from "./components/Replacer";

import "./index.less";
import { Rnd } from "react-rnd";


type DataList = {
  [tabId: string]: AjaxInterceptorRule[];
};

const buildUUID = () => {
  const dt = new Date().getTime();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (dt + Math.random() * 16) % 16 | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
};

const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Enhanced column analysis and type detection
interface ColumnInfo {
  dataIndex: string;
  title?: string;
  render?: string;
  detectedType: 'id' | 'string' | 'number' | 'array' | 'boolean' | 'date' | 'mapped' | 'location' | 'business';
  mappedValues?: Record<string | number, string>;
  isArrayField?: boolean;
}

// Analyze column definition to determine data type
function analyzeColumn(columnText: string): ColumnInfo {
  const dataIndexMatch = columnText.match(/dataIndex\s*:\s*['"`](\w+)['"`]/);
  const titleMatch = columnText.match(/title\s*:\s*['"`]([^'"`]+)['"`]/);
  const renderMatch = columnText.match(/render\s*:\s*\((.*?)\)\s*=>\s*([\s\S]*?)(?=,\s*}|\n\s*}|$)/);

  const dataIndex = dataIndexMatch?.[1] || '';
  const title = titleMatch?.[1] || '';
  const renderCode = renderMatch?.[0] || '';

  let detectedType: ColumnInfo['detectedType'] = 'string';
  let mappedValues: Record<string | number, string> | undefined;
  let isArrayField = false;

  const lower = dataIndex.toLowerCase();
  const titleLower = title.toLowerCase();

  // Detect array fields from render function
  if (renderCode.includes('?.join') || renderCode.includes('.map(') || renderCode.includes('businesses: string[]') || renderCode.includes('models: number[]')) {
    isArrayField = true;
    detectedType = 'array';
  }

  // Detect mapped values from render function
  const mapMatch = renderCode.match(/const\s+(\w+Map)\s*=\s*\{([^}]+)\}/);
  if (mapMatch) {
    detectedType = 'mapped';
    try {
      const mapContent = mapMatch[2];
      mappedValues = {};
      const entries = mapContent.match(/(\d+)\s*:\s*['"`]([^'"`]+)['"`]/g) || [];
      entries.forEach(entry => {
        const [, key, value] = entry.match(/(\d+)\s*:\s*['"`]([^'"`]+)['"`]/) || [];
        if (key && value) {
          mappedValues![parseInt(key)] = value;
        }
      });
    } catch (e) {
      console.warn('Failed to parse mapped values:', e);
    }
  }

  // Type detection based on field names and context
  if (!mappedValues && !isArrayField) {
    if (lower === 'id' || lower.endsWith('id')) {
      detectedType = 'id';
    } else if (lower.includes('count') || lower.includes('number') || renderCode.includes('value > 0')) {
      detectedType = 'number';
    } else if (lower.includes('time') || lower.includes('date') || titleLower.includes('时间') || titleLower.includes('日期')) {
      detectedType = 'date';
    } else if (lower.startsWith('is') || lower.startsWith('has') || renderCode.includes('=== 1 ?')) {
      detectedType = 'boolean';
    } else if (lower.includes('location') || titleLower.includes('地') || renderCode.includes('countryName') || renderCode.includes('province')) {
      detectedType = 'location';
    } else if (lower.includes('business') || lower.includes('main') || titleLower.includes('主营') || titleLower.includes('业务')) {
      detectedType = 'business';
    } else if (lower.includes('code') || titleLower.includes('代码') || titleLower.includes('编码')) {
      detectedType = 'string';
    }
  }

  return {
    dataIndex,
    title,
    render: renderCode,
    detectedType,
    mappedValues,
    isArrayField
  };
}

// Generate mock value based on analyzed column info
function generateMockValue(columnInfo: ColumnInfo, index: number): any {
  const { dataIndex, detectedType, mappedValues, isArrayField } = columnInfo;

  switch (detectedType) {
    case 'id':
      if (dataIndex === 'id') {
        return index + 1000; // Primary ID as number
      }
      return `${dataIndex.toUpperCase()}-${(index + 1).toString().padStart(4, '0')}`;

    case 'number':
      if (dataIndex.includes('count') || dataIndex.includes('Count')) {
        return Math.floor(Math.random() * 100) + index;
      }
      return Math.floor(Math.random() * 1000) + index * 10;

    case 'date':
      const baseDate = new Date(2024, 0, 1);
      baseDate.setDate(baseDate.getDate() + index * 30);
      return baseDate.toISOString().split('T')[0];

    case 'boolean':
      if (dataIndex === 'isShow') {
        return Math.random() > 0.3 ? 1 : 0; // More likely to be shown
      }
      if (dataIndex.includes('isMerge')) {
        return [1, 2, 3][index % 3]; // Different merge states
      }
      return Math.random() > 0.5 ? 1 : 0;

    case 'mapped':
      if (mappedValues) {
        const keys = Object.keys(mappedValues).map(k => parseInt(k));
        return keys[index % keys.length];
      }
      return index % 3 + 1;

    case 'array':
      if (dataIndex.includes('main') || dataIndex.includes('Business')) {
        const businesses = ['纺织服装', '电子产品', '机械制造', '化工材料', '食品饮料', '建材家居'];
        const count = Math.min(3, Math.max(1, index % 4));
        return Array.from({length: count}, (_, i) => businesses[(index + i) % businesses.length]);
      }
      if (dataIndex.includes('management') || dataIndex.includes('Model') || dataIndex.includes('foundry')) {
        const maxItems = mappedValues ? Object.keys(mappedValues).length : 3;
        const count = Math.min(2, Math.max(1, (index % 3) + 1));
        return Array.from({length: count}, (_, i) => (i + 1) + (index % maxItems));
      }
      return [`item-${index}-1`, `item-${index}-2`];

    case 'location':
      const countries = ['中国', '美国', '德国', '日本'];
      const provinces = ['广东省', '江苏省', '浙江省', '北京市', '上海市'];
      const cities = ['深圳市', '苏州市', '杭州市', '朝阳区', '浦东新区'];

      if (dataIndex === 'location') {
        // This will be processed by render function to show "country / province / city"
        return null; // The actual location data is in separate fields
      }

      if (dataIndex.includes('country')) {
        return countries[index % countries.length];
      }
      if (dataIndex.includes('province')) {
        return provinces[index % provinces.length];
      }
      if (dataIndex.includes('city')) {
        return cities[index % cities.length];
      }

      return `${provinces[index % provinces.length]} ${cities[index % cities.length]}`;

    case 'business':
      const businessTypes = ['制造业', '服务业', '贸易业', '科技业', '金融业'];
      return businessTypes[index % businessTypes.length];

    case 'string':
    default:
      if (dataIndex.includes('name') || dataIndex.includes('Name')) {
        const companyNames = ['华为科技有限公司', '腾讯控股有限公司', '阿里巴巴集团', '百度在线网络技术', '京东数科控股', '美团点评集团'];
        if (dataIndex.includes('enterprise') || dataIndex.includes('Enterprise')) {
          return companyNames[index % companyNames.length];
        }
        return `${companyNames[index % companyNames.length].split('')[0]}${dataIndex}-${index + 1}`;
      }
      if (dataIndex.includes('code') || dataIndex.includes('Code')) {
        // Generate realistic social credit codes
        if (dataIndex.includes('social') || dataIndex.includes('credit')) {
          return `91${Math.random().toString().slice(2, 8)}${String(index).padStart(8, '0')}0${String(Math.floor(Math.random() * 10))}`;
        }
        return `CODE${Math.random().toString(36).slice(2, 8).toUpperCase()}${String(index).padStart(3, '0')}`;
      }
      return `${dataIndex}-值-${index + 1}`;
  }
}

// TypeScript interface parsing
interface TSField {
  name: string;
  type: string;
  isOptional: boolean;
  isArray: boolean;
  comment?: string;
  enumValues?: (number | string)[];
  nestedInterface?: TSInterface;
}

interface TSInterface {
  name: string;
  fields: TSField[];
  isRoot?: boolean;
}

// Content type detection
type ContentType = 'columns' | 'typescript' | 'unknown';

function detectContentType(content: string): ContentType {
  const trimmed = content.trim();

  // Check for TypeScript interface
  if (trimmed.includes('interface ') &&
      (trimmed.includes('export interface') || trimmed.includes('interface ')) &&
      trimmed.includes('{') && trimmed.includes('}')) {
    return 'typescript';
  }

  // Check for columns array
  if ((trimmed.includes('dataIndex') && trimmed.includes('title')) ||
      (trimmed.includes('[') && trimmed.includes('dataIndex'))) {
    return 'columns';
  }

  return 'unknown';
}

function extractBalancedBlock(source: string, openBraceIndex: number): { content: string; endIndex: number } | null {
  let depth = 0;
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inTemplateString = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = openBraceIndex; i < source.length; i++) {
    const char = source[i];
    const nextChar = source[i + 1];

    if (inLineComment) {
      if (char === '\n') {
        inLineComment = false;
      }
      continue;
    }

    if (inBlockComment) {
      if (char === '*' && nextChar === '/') {
        inBlockComment = false;
        i++;
      }
      continue;
    }

    if (inSingleQuote) {
      if (char === '\\') {
        i++;
        continue;
      }
      if (char === "'") {
        inSingleQuote = false;
      }
      continue;
    }

    if (inDoubleQuote) {
      if (char === '\\') {
        i++;
        continue;
      }
      if (char === '"') {
        inDoubleQuote = false;
      }
      continue;
    }

    if (inTemplateString) {
      if (char === '\\') {
        i++;
        continue;
      }
      if (char === '`') {
        inTemplateString = false;
      }
      continue;
    }

    if (char === '/' && nextChar === '/') {
      inLineComment = true;
      i++;
      continue;
    }

    if (char === '/' && nextChar === '*') {
      inBlockComment = true;
      i++;
      continue;
    }

    if (char === "'") {
      inSingleQuote = true;
      continue;
    }

    if (char === '"') {
      inDoubleQuote = true;
      continue;
    }

    if (char === '`') {
      inTemplateString = true;
      continue;
    }

    if (char === '{') {
      depth++;
    } else if (char === '}') {
      depth--;
      if (depth === 0) {
        return {
          content: source.slice(openBraceIndex + 1, i),
          endIndex: i
        };
      }
    }
  }

  return null;
}

function parseTypeScriptInterface(content: string): TSInterface | null {
  try {
    // Extract main interface - handle the case where it ends with multiple }
    const interfaceMatch = content.match(/export\s+interface\s+(\w+)\s*\{([\s\S]*?)(\n\}.*$)/m);
    if (!interfaceMatch) return null;

    const interfaceName = interfaceMatch[1];
    const interfaceBody = interfaceMatch[2];

    // For response interfaces, focus on the data field if it exists
    const dataFieldRegex = /data\?\s*:\s*\{/m;
    const dataFieldMatch = dataFieldRegex.exec(interfaceBody);

    let fieldsToProcess = interfaceBody;
    let isDataInterface = false;

    if (dataFieldMatch) {
      const openBraceIndex = interfaceBody.indexOf('{', dataFieldMatch.index);
      if (openBraceIndex !== -1) {
        const extracted = extractBalancedBlock(interfaceBody, openBraceIndex);
        if (extracted) {
          fieldsToProcess = extracted.content;
          isDataInterface = true;
          console.log('Found data field, processing nested interface...');
        }
      }
    }

    const fields = parseInterfaceFields(fieldsToProcess, content);

    return {
      name: isDataInterface ? `${interfaceName}_Data` : interfaceName,
      fields,
      isRoot: true
    };
  } catch (e) {
    console.warn('Failed to parse TypeScript interface:', e);
    return null;
  }
}

function parseInterfaceFields(body: string, fullContent: string): TSField[] {
  const fields: TSField[] = [];

  // Enhanced parsing to handle complex multi-line nested structures
  const lines = body.split('\n');

  let currentField = '';
  let currentComment = '';
  let inMultiLineComment = false;
  let inField = false;
  let bracketDepth = 0;
  let squareBracketDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
      if (inField) {
        currentField += '\n' + line; // Preserve empty lines in field definitions
      }
      continue;
    }

    // Handle multi-line comments
    if (trimmed.includes('/**')) {
      // If we're in a field, this might be a new comment for the next field
      if (inField && bracketDepth > 0) {
        currentField += '\n' + line;
        continue;
      }

      inMultiLineComment = true;
      currentComment = trimmed.replace('/**', '').replace(/^\*+\s*/, '').trim();
      continue;
    }

    if (inMultiLineComment) {
      if (trimmed.includes('*/')) {
        const commentPart = trimmed.replace('*/', '').replace(/^\*+\s*/, '').trim();
        if (commentPart) {
          currentComment += (currentComment ? ' ' : '') + commentPart;
        }
        inMultiLineComment = false;
      } else {
        const commentText = trimmed.replace(/^\*+\s*/, '');
        if (commentText) {
          currentComment += (currentComment ? ' ' : '') + commentText;
        }
      }
      continue;
    }

    // Skip comment lines that are not part of field definitions
    if (trimmed.startsWith('//') || (trimmed.startsWith('*') && !trimmed.includes(':') && !inField)) {
      continue;
    }

    // Check if this line starts a new field definition (has : and field name pattern)
    const fieldStartMatch = trimmed.match(/^(\w+)(\?)?:\s*(.*)$/);

    if (fieldStartMatch && !inField) {
      console.log(`[KK Ajax Monitor] ✓ Detected field start: "${fieldStartMatch[1]}" from line: "${trimmed}"`);
      // Start new field
      inField = true;
      currentField = line;

      // Count brackets
      bracketDepth = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      squareBracketDepth = (line.match(/\[/g) || []).length - (line.match(/\]/g) || []).length;

      console.log(`[KK Ajax Monitor] Starting field: ${fieldStartMatch[1]}, brackets: {${bracketDepth}, [${squareBracketDepth}]`);

      // Check if field is immediately complete (simple field on one line)
      if (bracketDepth === 0 && squareBracketDepth === 0 &&
          (trimmed.endsWith(';') || trimmed.endsWith(','))) {
        const field = parseField(currentField, currentComment, fullContent);
        if (field) {
          fields.push(field);
          console.log(`[KK Ajax Monitor] Completed simple field: ${field.name}`);
        }
        currentField = '';
        currentComment = '';
        inField = false;
      }
    } else if (inField) {
      // Continue collecting multi-line field definition
      currentField += '\n' + line;

      // Update bracket counts
      bracketDepth += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      squareBracketDepth += (line.match(/\[/g) || []).length - (line.match(/\]/g) || []).length;

      console.log(`[KK Ajax Monitor] Continuing field, brackets: {${bracketDepth}, [${squareBracketDepth}], line: ${trimmed.substring(0, 50)}...`);

      // Check if field is complete (balanced brackets and ends properly)
      if (bracketDepth === 0 && squareBracketDepth === 0) {
        // Look ahead to see if the next non-empty line starts a new field or we're at the end
        let isFieldEnd = false;

        if (trimmed.endsWith(';') || trimmed.endsWith(',')) {
          isFieldEnd = true;
          console.log(`[KK Ajax Monitor] Field ends with semicolon/comma: ${trimmed}`);
        } else {
          // Look ahead to see if next line starts a new field
          console.log(`[KK Ajax Monitor] Looking ahead from line ${i + 1} to detect field end`);
          for (let j = i + 1; j < lines.length; j++) {
            const nextTrimmed = lines[j].trim();
            console.log(`[KK Ajax Monitor] Checking line ${j}: "${nextTrimmed}"`);

            if (!nextTrimmed || nextTrimmed.startsWith('*') || nextTrimmed.startsWith('//') || nextTrimmed.startsWith('/**')) {
              console.log(`[KK Ajax Monitor] Skipping comment/empty line`);
              continue;
            }

            // More comprehensive field start detection
            const isFieldStart = nextTrimmed.match(/^(\w+)(\?)?:\s*/);
            const isInterfaceEnd = nextTrimmed.startsWith('}');
            const isIndexSignature = nextTrimmed === '[k: string]: any;';

            if (isFieldStart || isInterfaceEnd || isIndexSignature) {
              isFieldEnd = true;
              console.log(`[KK Ajax Monitor] Detected field end due to: ${isFieldStart ? 'field start' : isInterfaceEnd ? 'interface end' : 'index signature'}`);
              break;
            } else if (nextTrimmed && !nextTrimmed.match(/^[\s\}\],;]*$/)) {
              // If we find non-whitespace, non-bracket content that's not a field start, continue this field
              console.log(`[KK Ajax Monitor] Found continuation content, not ending field: "${nextTrimmed}"`);
              break;
            }
          }
        }

        if (isFieldEnd) {
          const field = parseField(currentField, currentComment, fullContent);
          if (field) {
            fields.push(field);
            console.log(`[KK Ajax Monitor] Completed complex field: ${field.name} (${field.type}${field.isArray ? '[]' : ''})`);
          }
          currentField = '';
          currentComment = '';
          inField = false;
        }
      }
    } else if (fieldStartMatch && inField) {
      // This suggests we missed the end of the previous field
      console.warn(`[KK Ajax Monitor] ⚠ Found field start "${fieldStartMatch[1]}" while already parsing a field. Previous field might not have ended properly.`);
      console.warn(`[KK Ajax Monitor] Current field name: ${currentField.split('\n')[0].trim().split(':')[0]}`)
      console.warn(`[KK Ajax Monitor] Current field content (first 200 chars):`, currentField.substring(0, 200));
      console.warn(`[KK Ajax Monitor] Bracket state: {${bracketDepth}, [${squareBracketDepth}]`);

      // Force end the current field and start the new one
      if (currentField) {
        const field = parseField(currentField, currentComment, fullContent);
        if (field) {
          fields.push(field);
          console.log(`[KK Ajax Monitor] ✓ Force-completed previous field: ${field.name}`);
        } else {
          console.warn(`[KK Ajax Monitor] ✗ Failed to parse previous field`);
        }
      }

      // Start the new field
      inField = true;
      currentField = line;
      currentComment = '';
      bracketDepth = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      squareBracketDepth = (line.match(/\[/g) || []).length - (line.match(/\]/g) || []).length;
      console.log(`[KK Ajax Monitor] ✓ Starting new field after force-complete: ${fieldStartMatch[1]}, brackets: {${bracketDepth}, [${squareBracketDepth}]`);
    }
  }

  // Handle case where we're still in a field at the end
  if (inField && currentField) {
    const field = parseField(currentField, currentComment, fullContent);
    if (field) {
      fields.push(field);
      console.log(`[KK Ajax Monitor] Completed final field: ${field.name}`);
    }
  }

  console.log(`[KK Ajax Monitor] parseInterfaceFields found ${fields.length} fields:`,
              fields.map(f => `${f.name}: ${f.type}${f.isArray ? '[]' : ''}`));

  return fields;
}

function parseField(fieldDef: string, comment: string, fullContent: string): TSField | null {
  try {
    // More robust field parsing for complex nested structures
    const lines = fieldDef.split('\n');
    const firstLine = lines[0].trim();

    // Parse field: name?: type;
    const match = firstLine.match(/(\w+)(\?)?:\s*(.*)/);
    if (!match) return null;

    const [, name, optional] = match;
    const isOptional = !!optional;

    let type = '';
    let isArray = false;
    let enumValues: (number | string)[] | undefined;
    let nestedInterface: TSInterface | undefined;

    // Determine type from the field definition
    if (fieldDef.includes('{')) {
      // This is a nested object type
      type = 'object';

      // Extract the content between the first { and last }
      const openBraceIndex = fieldDef.indexOf('{');
      const lastCloseBraceIndex = fieldDef.lastIndexOf('}');

      if (openBraceIndex !== -1 && lastCloseBraceIndex !== -1 && lastCloseBraceIndex > openBraceIndex) {
        const nestedContent = fieldDef.substring(openBraceIndex + 1, lastCloseBraceIndex);

        // Check if it's an array of objects
        if (fieldDef.includes('}[]') || fieldDef.includes('}[];')) {
          isArray = true;
        }

        try {
          nestedInterface = {
            name: `${name}_nested`,
            fields: parseInterfaceFields(nestedContent, fullContent),
            isRoot: false
          };

          console.log(`[KK Ajax Monitor] Parsed nested interface for ${name}:`, nestedInterface.fields.length, 'fields');
          nestedInterface.fields.forEach(f => console.log(`  - ${f.name}: ${f.type}${f.isArray ? '[]' : ''}`));
        } catch (e) {
          console.warn('Failed to parse nested interface for', name, e);
        }
      }
    } else {
      // Simple type - extract from first line
      const typeMatch = firstLine.match(/:\s*([^;,\n]+)/);
      if (typeMatch) {
        type = typeMatch[1].trim();

        // Handle array types
        if (type.endsWith('[]')) {
          isArray = true;
          type = type.slice(0, -2).trim();
        }
      }
    }

    // Extract enum values from comments
    if (comment) {
      // Look for patterns like "1-启用、2-合并后启用" or "1-OEM、2-ODM"
      const enumMatch = comment.match(/(\d+)-([^,，、]+)/g);
      if (enumMatch) {
        enumValues = [];
        enumMatch.forEach(match => {
          const parts = match.match(/(\d+)-(.+)/);
          if (parts) {
            enumValues!.push(parseInt(parts[1]));
          }
        });
      }
    }

    // Default type if not determined
    if (!type) {
      type = 'string';
    }

    return {
      name,
      type,
      isOptional,
      isArray,
      comment,
      enumValues,
      nestedInterface
    };
  } catch (e) {
    console.warn('Failed to parse field:', fieldDef.substring(0, 100) + '...', e);
    return null;
  }
}

function generateMockDataFromInterface(tsInterface: TSInterface, count: number = 1): any {
  // Generate a single data object based on the interface
  const dataObject: Record<string, any> = {};

  console.log(`[KK Ajax Monitor] Generating mock data for interface: ${tsInterface.name}`);
  console.log(`[KK Ajax Monitor] Interface has ${tsInterface.fields.length} fields:`,
              tsInterface.fields.map(f => `${f.name}${f.isOptional ? '?' : ''}: ${f.type}${f.isArray ? '[]' : ''}${f.nestedInterface ? ' (nested)' : ''}`));

  tsInterface.fields.forEach(field => {
    console.log(`[KK Ajax Monitor] Generating field: ${field.name} (${field.type}${field.isArray ? '[]' : ''})${field.nestedInterface ? ' - has nested interface with ' + field.nestedInterface.fields.length + ' fields' : ''}`);

    // Generate value for all fields, including optional ones
    const value = generateValueFromTSField(field, 0);
    dataObject[field.name] = value;

    console.log(`[KK Ajax Monitor] Generated ${field.name}:`, typeof value, Array.isArray(value) ? `array[${value.length}]` : value?.toString?.()?.substring(0, 100) || 'null');
  });

  console.log(`[KK Ajax Monitor] Final data object has ${Object.keys(dataObject).length} properties:`, Object.keys(dataObject));

  // For response interfaces, generate the full response structure
  if (tsInterface.name.includes('Response') || tsInterface.name.includes('_Data')) {
    return {
      success: true,
      code: 200,
      messageEn: "",
      messageCn: "",
      data: dataObject
    };
  }

  // For non-response interfaces, return the data object directly
  return dataObject;
}

function generateValueFromTSField(field: TSField, index: number): any {
  const { name, type, isArray, comment, enumValues, nestedInterface } = field;

  // Handle nested objects first
  if (type === 'object' && nestedInterface) {
    const nestedObj: Record<string, any> = {};
    nestedInterface.fields.forEach(nestedField => {
      nestedObj[nestedField.name] = generateValueFromTSField(nestedField, index);
    });

    if (isArray) {
      // For arrays of objects
      const count = Math.min(2, Math.max(1, (index % 2) + 1));
      return Array.from({length: count}, (_, i) => {
        const obj: Record<string, any> = {};
        nestedInterface.fields.forEach(nestedField => {
          obj[nestedField.name] = generateValueFromTSField(nestedField, i);
        });
        return obj;
      });
    }

    return nestedObj;
  }

  // Handle enum values from comments
  if (enumValues && enumValues.length > 0) {
    if (isArray) {
      const count = Math.min(2, Math.max(1, (index % 2) + 1));
      return Array.from({length: count}, (_, i) => enumValues[(i + index) % enumValues.length]);
    }
    return enumValues[index % enumValues.length];
  }

  // Generate based on field name and type
  const nameLower = name.toLowerCase();

  let baseValue: any;

  if (type === 'number') {
    if (nameLower.includes('id')) {
      baseValue = index + 1000;
    } else if (nameLower.includes('time') || nameLower.includes('at')) {
      baseValue = Date.now() - (Math.random() * 365 * 24 * 60 * 60 * 1000); // Random time in past year
    } else if (nameLower.includes('count') || nameLower.includes('size') || nameLower.includes('area')) {
      baseValue = Math.floor(Math.random() * 1000) + index * 10;
    } else {
      baseValue = index + 1;
    }
  } else if (type === 'string') {
    if (nameLower.includes('name')) {
      if (nameLower.includes('enterprise')) {
        const companies = ['华为科技有限公司', '腾讯控股有限公司', '阿里巴巴集团', '百度在线网络技术', '京东数科控股'];
        baseValue = companies[index % companies.length];
      } else if (nameLower.includes('country')) {
        const countries = ['中国', '美国', '德国', '日本', '韩国'];
        baseValue = countries[index % countries.length];
      } else {
        baseValue = `${name}-${index + 1}`;
      }
    } else if (nameLower.includes('code')) {
      if (nameLower.includes('social') || nameLower.includes('credit')) {
        baseValue = `91${Math.random().toString().slice(2, 8)}${String(index).padStart(8, '0')}0${String(Math.floor(Math.random() * 10))}`;
      } else {
        baseValue = `CODE${Math.random().toString(36).slice(2, 8).toUpperCase()}${String(index).padStart(3, '0')}`;
      }
    } else if (nameLower.includes('address')) {
      const addresses = ['深圳市南山区科技园', '北京市朝阳区CBD', '上海市浦东新区张江', '广州市天河区珠江新城'];
      baseValue = addresses[index % addresses.length];
    } else if (nameLower.includes('email')) {
      baseValue = `user${index + 1}@example.com`;
    } else if (nameLower.includes('phone')) {
      baseValue = `138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`;
    } else if (nameLower.includes('business')) {
      const businesses = ['纺织服装', '电子产品', '机械制造', '化工材料', '食品饮料', '建材家居'];
      baseValue = businesses[index % businesses.length];
    } else {
      baseValue = `${name}-${index + 1}`;
    }
  } else if (type === 'boolean') {
    baseValue = Math.random() > 0.5;
  } else {
    // Default string value
    baseValue = `${name}-${index + 1}`;
  }

  // Handle arrays
  if (isArray) {
    if (type === 'string') {
      if (nameLower.includes('business') || nameLower.includes('image')) {
        const count = Math.min(3, Math.max(1, (index % 3) + 1));
        return Array.from({length: count}, (_, i) => `${baseValue}-${i + 1}`);
      }
    }
    const count = Math.min(3, Math.max(1, (index % 3) + 1));
    return Array.from({length: count}, () => baseValue);
  }

  return baseValue;
}

// Legacy function for backward compatibility
function mockValue(field: string, i: number): any {
  const columnInfo = analyzeColumn(`dataIndex: '${field}'`);
  return generateMockValue(columnInfo, i - 1);
}

// @ts-ignore
const IconComponent = ({
  icon: Icon,
  ...props
}: {
  icon: IconType;
  [key: string]: any;
  // @ts-ignore
}) => <Icon {...props} />;

const App = () => {
  const [interceptedRequests, setInterceptedRequests] = useState({});
  const [showAllRules, setShowAllRules] = useState(false);
  const [positionClass, setPositionClass] = useState("suspend");
  const [customFunction, setCustomFunction] = useState({ panelPosition: 0 });
  const [showRefreshTip, setShowRefreshTip] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [newTabName, setNewTabName] = useState("");
  const [searchUrl, setSearchUrl] = useState("");
  const forceUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [activeKey, setActiveKey] = useState<string | undefined>(undefined);
  const [isCreating, setIsCreating] = useState(false);

  const [switchOn, setSwitchOn] = useState(false);
  const [rules, setRules] = useState<AjaxInterceptorRule[]>([]);
  const [dataList, setDataList] = useState<DataList>({});
  const [duplicateMatch, setDuplicateMatch] = useState<AjaxInterceptorRule[]>(
    []
  );
  const [columnsInput, setColumnsInput] = useState('');
  const [contentType, setContentType] = useState<ContentType>('unknown');

  const tableBoxRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [tableBoxHeight, setTableBoxHeight] = useState(0);
  const [showDetail, setShowDetail] = useState(false);
  const [currentEditRule, setCurrentEditRule] =
    useState<AjaxInterceptorRule | null>(null);
  useEffect(() => {
    if (tableBoxRef.current) {
      setTableBoxHeight(
        window.innerHeight - tableBoxRef.current.offsetTop - 34
      );
    }
  }, [tableBoxRef.current, switchOn]);

  const readRulesFromStorage = () => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(["ajaxInterceptor_rules"], (result) => {
        // setRules(result.ajaxInterceptor_rules || []);
        resolve((result.ajaxInterceptor_rules as any) || []);
      });
    });
  };

  useEffect(() => {
    chrome.storage.local.get(
      ["ajaxInterceptor_switchOn", "ajaxInterceptor_rules", "customFunction"],
      (result) => {
        setSwitchOn(result.ajaxInterceptor_switchOn || false);

        // Only load existing rules, don't create empty default rule
        if (
          result.ajaxInterceptor_rules &&
          result.ajaxInterceptor_rules.length > 0
        ) {
          setRules(result.ajaxInterceptor_rules);
        } else {
          setRules([]);
        }

        setCustomFunction(result.customFunction || { panelPosition: 0 });
        setIsLoading(false);
      }
    );

    window.addEventListener("resize", () => {
      if (tableBoxRef.current) {
        setTableBoxHeight(
          window.innerHeight - tableBoxRef.current.offsetTop - 34
        );
      }
    });

    setupMessageListener();
    notifyBackgroundScriptLoaded();
  }, []);

  const groupRulesByTab = useCallback(() => {
    const groupedRules = rules.reduce((acc, rule) => {
      const tab = rule.tabId || "Default";
      if (!acc[tab]) {
        acc[tab] = [];
      }
      acc[tab].push(rule);
      return acc;
    }, {} as DataList);

    if (Object.keys(groupedRules).length === 0) {
      groupedRules["Default"] = [];
    }

    setDataList(groupedRules);

    // Only set the activeKey if it's not already set
    if (!activeKey) {
      const firstTabId = Object.keys(groupedRules)[0];
      setActiveKey(firstTabId);
    }
  }, [rules, activeKey]);

  useEffect(() => {
    groupRulesByTab();
  }, [rules, groupRulesByTab]);

  const setupMessageListener = () => {
    chrome.runtime.onMessage.addListener(handleIncomingMessage);
  };

  const uploadProps: any = {
    name: "file",
    action: "#",
    accept: ".json",
    showUploadList: false,
    beforeUpload(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonDatabase = JSON.parse(e.target?.result as string);
          console.log("jsonDatabase", jsonDatabase);
          if (jsonDatabase.length > 0) {
            jsonDatabase.forEach((rule) => {
              try {
                rule.overrideTxt = JSON.stringify(rule.overrideTxt);
              } catch (error) {
                rule.overrideTxt = "{}";
              }
            });
            setRules(jsonDatabase);
            set("ajaxInterceptor_rules", jsonDatabase);
            groupRulesByTab();
            message.success(`${file.name} uploaded successfully`);
          } else {
            message.error("Failed to parse JSON file");
          }
        } catch (error) {
          message.error("Failed to parse JSON file");
          console.error(error);
        }
      };
      reader.readAsText(file);
      return false; // Prevent default upload behavior
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
    },
  };

  const handleIncomingMessage = useCallback(
    ({
      type,
      to,
      url,
      match,
      contentScriptLoaded = false,
      showFreshTip = false,
    }) => {
      if (type === "ajaxInterceptor" && to === "iframe") {
        if (contentScriptLoaded || showFreshTip) {
          setShowRefreshTip(showFreshTip);
          return;
        }
        setInterceptedRequests((prev) => {
          const newRequests = { ...prev };
          if (!newRequests[match]) newRequests[match] = [];
          const exists = newRequests[match].some((obj) => {
            if (obj.url === url) {
              obj.num++;
              return true;
            }
            return false;
          });
          if (!exists) {
            newRequests[match].push({ url, num: 1 });
          }
          return newRequests;
        });
      }
    },
    []
  );

  const notifyBackgroundScriptLoaded = () => {
    chrome.runtime.sendMessage(chrome.runtime.id, {
      type: "ajaxInterceptor",
      to: "background",
      iframeScriptLoaded: true,
    });
  };

  const set = (key, value) => {
    setIsLoading(true);
    // First ensure we have the latest state before sending messages
    chrome.storage?.local.set({ [key]: value }, () => {
      console.log(`[set] key: ${key}, value: ${value}`);
      chrome.runtime.sendMessage(chrome.runtime.id, {
        type: "ajaxInterceptor",
        to: "background",
        key,
        value,
      });
    });
    setIsLoading(false);
  };

  const forceUpdateDebouce = () => {
    if (forceUpdateTimeoutRef.current) {
      clearTimeout(forceUpdateTimeoutRef.current);
    }
    forceUpdateTimeoutRef.current = setTimeout(() => {
      forceUpdate();
    }, 1000);
  };

  const handleSingleSwitchChange = (switchOn, ruleId) => {
    console.log("handleSingleSwitchChange", switchOn, ruleId);
    setRules((prevRules) => {
      const newRules = prevRules.map((rule) =>
        rule.id === ruleId ? { ...rule, switchOn } : rule
      );
      set("ajaxInterceptor_rules", newRules);
      return newRules;
    });
  };

  const handleLimitMethodChange = (val, ruleId) => {
    setRules((prevRules) => {
      const newRules = prevRules.map((rule) =>
        rule.id === ruleId ? { ...rule, limitMethod: val } : rule
      );
      set("ajaxInterceptor_rules", newRules);
      return newRules;
    });
  };

  const handleExportRules = () => {
    const rulesForExport = rules.map((rule) => ({
      ...rule,
      overrideTxt:
        typeof rule.overrideTxt === "string"
          ? (() => {
              try {
                return JSON.parse(rule.overrideTxt);
              } catch (e) {
                return rule.overrideTxt;
              }
            })()
          : rule.overrideTxt,
    }));
    const dataStr = JSON.stringify(rulesForExport, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
      dataStr
    )}`;
    const exportFileDefaultName = "ajax_interceptor_rules.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  useEffect(() => {
    console.log("searchName", searchName);
    console.log("searchUrl", searchUrl);
    if (searchName || searchUrl) {
      setRules((prevRules) => {
        const newRules = prevRules.filter((rule) => {
          return (
            rule.label.includes(searchName) && rule.match.includes(searchUrl)
          );
        });
        console.log("newRules", newRules);
        return newRules;
      });
    } else {
      readRulesFromStorage().then((rules) => {
        setRules(rules as any);
      });
    }
  }, [searchName, searchUrl]);

  const handleFilterTypeChange = (val, ruleId) => {
    setRules((prevRules) => {
      const newRules = prevRules.map((rule) =>
        rule.id === ruleId ? { ...rule, filterType: val } : rule
      );
      set("ajaxInterceptor_rules", newRules);
      return newRules;
    });
  };

  const handleMatchChange = (e, ruleId) => {
    const value = e.target.value.replace(/\n$/, "");
    setRules((prevRules) => {
      const newRules = prevRules.map((rule) =>
        rule.id === ruleId ? { ...rule, match: value } : { ...rule }
      );
      console.log(`[handleMatchChange] newRules:`, newRules);
      return newRules;
    });
  };

  const handleLabelChange = (e, ruleId) => {
    setRules((prevRules) => {
      const newRules = prevRules.map((rule) =>
        rule.id === ruleId ? { ...rule, label: e.target.value } : rule
      );
      // set('ajaxInterceptor_rules', newRules);
      return newRules;
    });
  };

  const handleAddNewRule = () => {
    setIsCreating(true);
    const newRule: AjaxInterceptorRule = {
      id: generateUniqueId(),
      match: "",
      label: `New Rule ${rules.length + 1}`,
      switchOn: true,
      key: buildUUID(),
      tabId: "Default",
    };
    setCurrentEditRule(newRule);
    setShowDetail(true);
  };

  const handleClickAdd = (tabId) => {
    const newRule: AjaxInterceptorRule = {
      id: generateUniqueId(),
      match: "",
      label: `New Rule ${rules.length + 1}`,
      switchOn: true,
      key: buildUUID(),
      tabId: tabId,
    };
    setActiveKey(tabId);
    setRules((prevRules) => {
      const newRules = [...prevRules, newRule];
      // set('ajaxInterceptor_rules', newRules);
      return newRules;
    });
  };

  const handleBatchRemove = (
    ruleIds: string[],
    needGroupRulesByTab = false
  ) => {
    setRules((prevRules) => {
      const newRules = prevRules.filter((rule) => !ruleIds.includes(rule.id));
      set("ajaxInterceptor_rules", newRules);
      return newRules;
    });

    setInterceptedRequests((prev) => {
      const newRequests = { ...prev };
      ruleIds.forEach((id) => {
        const rule = rules.find((r) => r.id === id);
        if (rule) {
          delete newRequests[rule.match];
          delete newRequests[rule.label];
        }
      });
      return newRequests;
    });

    if (needGroupRulesByTab) {
      groupRulesByTab();
    } else {
      setDataList((prevDataList) => {
        const newDataList = { ...prevDataList };
        Object.keys(newDataList).forEach((tabId) => {
          newDataList[tabId] = newDataList[tabId].filter(
            (rule) => !ruleIds.includes(rule.id)
          );
        });
        return newDataList;
      });
    }
  };

  const handleClickRemove = (e, ruleId) => {
    e.stopPropagation();
    const currentTabId = activeKey;

    handleBatchRemove([ruleId]);

    setDataList((prevDataList) => {
      const newDataList = { ...prevDataList };
      if (currentTabId && newDataList[currentTabId]?.length === 0) {
        delete newDataList[currentTabId];
        const remainingTabs = Object.keys(newDataList);
        setActiveKey(remainingTabs.length > 0 ? remainingTabs[0] : undefined);
      }
      return newDataList;
    });
  };

  const handleCollaseChange = () => {};

  const handleSwitchChange = () => {
    console.log("handleSwitchChange");
    setSwitchOn((prev) => {
      const newSwitchOn = !prev;
      set("ajaxInterceptor_switchOn", newSwitchOn);
      return newSwitchOn;
    });
  };

  const handleSearch = (e) => {
    setSearchName(e.target.value);
  };

  const handleUrlSearch = (e) => {
    setSearchUrl(e.target.value);
  };

  const generateRandomString = (length: number): string => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  const handleTabEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: "add" | "remove"
  ) => {
    if (action === "add") {
      const newTabId = generateRandomString(5);
      handleClickAdd(newTabId);
    } else {
      const tabId = targetKey as string;
      let deletingRuleIds = dataList[tabId].map((rule) => rule.id);
      handleBatchRemove(deletingRuleIds, true);

      const remainingTabs = Object.keys(dataList).filter((id) => id !== tabId);
      // Set the activeKey to the last remaining tab, or undefined if no tabs left
      setActiveKey(
        remainingTabs.length > 0
          ? remainingTabs[remainingTabs.length - 1]
          : undefined
      );
    }
  };

  const renderRules = (rules: AjaxInterceptorRule[]) => {
    return rules.map((rule) => (
      <Panel key={rule.key} header={renderPanelHeader(rule)}>
        <Replacer
          updateAddBtnTop_interval={() => {}}
          ruleId={rule.id}
          set={set}
          rule={rule}
          rules={rules}
        />
        {renderInterceptedRequests(rule.match)}
      </Panel>
    ));
  };

  const renderPanelHeader = ({
    id,
    filterType = "normal",
    limitMethod = "ALL",
    match,
    label,
    switchOn = true,
    key,
  }) => (
    <div className="panel-header" onClick={(e) => e.stopPropagation()}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <Space.Compact>
          <Input
            size="small"
            placeholder="name"
            style={{
              maxWidth: "200px",
              flex: "auto",
              display: "inline-block",
            }}
            defaultValue={label}
            onChange={(e) => handleLabelChange(e, id)}
          />
          <Select
            size="small"
            defaultValue={limitMethod}
            style={{
              width: "1px",
              maxWidth: "120px",
              flex: "1.5 1 auto",
              display: "inline-block",
            }}
            onChange={(val) => handleLimitMethodChange(val, id)}
          >
            <Option value="ALL">ALL</Option>
            <Option value="GET">GET</Option>
            <Option value="POST">POST</Option>
            <Option value="PUT">PUT</Option>
            <Option value="HEAD">HEAD</Option>
            <Option value="DELETE">DELETE</Option>
            <Option value="OPTIONS">OPTIONS</Option>
          </Select>
          <Select
            size="small"
            defaultValue={filterType}
            style={{
              width: "1px",
              maxWidth: "120px",
              flex: "1.5 1 auto",
              display: "inline-block",
            }}
            onChange={(val) => handleFilterTypeChange(val, id)}
          >
            <Option value="normal">normal</Option>
            <Option value="regex">regex</Option>
          </Select>
        </Space.Compact>

        <Input.TextArea
          rows={2}
          size="small"
          placeholder={filterType === "normal" ? "eg: abc/get" : "eg: abc.*"}
          style={{
            flex: "1",
            width: "100%",
            display: "inline-block",
            marginTop: 10,
          }}
          defaultValue={match}
          onChange={(e) => handleMatchChange(e, id)}
        />
      </div>

      <div className="button-group">
        <Switch
          size="small"
          defaultChecked={switchOn}
          onChange={(val) => handleSingleSwitchChange(val, id)}
          style={{
            width: "28px",
            flex: "none",
            marginRight: "8px",
          }}
        />
        <Button
          danger
          type="primary"
          shape="circle"
          icon={<DeleteOutlined />}
          size="small"
          onClick={(e) => handleClickRemove(e, id)}
          style={{ width: "24px", flex: "none" }}
        />
      </div>
    </div>
  );

  const renderInterceptedRequests = (match) => {
    if (!interceptedRequests[match]) {
      return null;
    }

    return (
      <>
        <div className="intercepted-requests">Intercepted Networks:</div>
        <div className="intercepted">
          {interceptedRequests[match].map(({ url, num }) => (
            <Tooltip placement="top" title={url} key={url}>
              <Badge
                count={num}
                style={{
                  backgroundColor: "#fff",
                  color: "#999",
                  boxShadow: "0 0 0 1px #d9d9d9 inset",
                  marginTop: "-3px",
                  marginRight: "4px",
                }}
              />
              <span className="url">{url}</span>
            </Tooltip>
          ))}
        </div>
      </>
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleViewDetail = (text, record) => {
    setCurrentEditRule(record);
    setShowDetail(true);
  };

  const checkDuplicateMatch = (e) => {
    console.log(e);

    const currentMatch = e.target.value;
    readRulesFromStorage().then((rules) => {
      console.log(rules, currentMatch);
      // return duplicate match
      const duplicateMatch = (rules as any).filter(
        (rule) => rule.match === currentMatch
      );
      console.log(duplicateMatch);
      // return duplicateMatch;
      setDuplicateMatch(duplicateMatch);
    });
  };

  const tableColumns = [
    {
      title: "id",
      dataIndex: "id",
      width: "160px",
      ellipsis: true,
      key: "id",
      render: (text, record) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Name",
      width: "150px",
      dataIndex: "label",
      key: "label",
      ellipsis: true,
    },
    {
      title: "Enable",
      width: "120px",
      dataIndex: "switchOn",
      key: "switchOn",
      render: (text, record) => (
        <Switch
          checked={record.switchOn}
          onChange={(val) => handleSingleSwitchChange(val, record.id)}
        />
      ),
    },
    {
      title: "match",
      dataIndex: "match",
      key: "match",
      ellipsis: true,
      render: (text, record) => (
        <Tooltip placement="topLeft" title={text}>
          <Space.Compact>
            <Button
              type="text"
              icon={<CopyOutlined />}
              size="small"
              onClick={() => {
                // copy match
                navigator.clipboard.writeText(record.match || "");
                message.success("Copied to clipboard");
              }}
            />

            <Button
              type="link"
              size="small"
              onClick={() => handleViewDetail(text, record)}
            >
              {text}
            </Button>
          </Space.Compact>
        </Tooltip>
      ),
    },
    {
      title: "Action",
      width: "100px",
      render: (text, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => handleViewDetail(text, record)}
            icon={<EditOutlined />}
          />
          <Button
            type="text"
            danger
            onClick={(e) => handleClickRemove(e, record.id)}
            icon={<DeleteOutlined />}
          />
        </Space>
      ),
    },
  ];

  const handleRulesChange = (data) => {
    console.log(1);
    if (currentEditRule) {
      setCurrentEditRule({
        ...currentEditRule,
        overrideTxt: JSON.stringify(data),
      });
    }
  };
  const handleUpdateRules = () => {
    if (currentEditRule) {
      // Validate rule before saving
      if (!currentEditRule.match || currentEditRule.match.trim() === "") {
        message.error("Match pattern is required and cannot be empty");
        return;
      }

      if (!currentEditRule.label || currentEditRule.label.trim() === "") {
        message.error("Label is required and cannot be empty");
        return;
      }

      readRulesFromStorage().then((rules) => {
        const index = (rules as any).findIndex(
          (rule) => rule.id === currentEditRule.id
        );
        let newRules = [...(rules as any)];
        if (index !== -1) {
          newRules[index] = currentEditRule;
        } else {
          // new rule
          newRules.push(currentEditRule);
        }
        setRules(newRules);
        set("ajaxInterceptor_rules", newRules);
        setShowDetail(false);
        setIsCreating(false);
      });
    }
  };

  const handleGenerateMockData = () => {
    try {
      // Parse the entire columns array instead of just extracting dataIndex
      const columnsText = columnsInput.trim();

      // Handle TypeScript interfaces
      if (contentType === 'typescript') {
        const parsedInterface = parseTypeScriptInterface(columnsText);
        if (parsedInterface) {
          console.log('Parsed TypeScript interface:', parsedInterface);
          const mockData = generateMockDataFromInterface(parsedInterface);
          console.log('Generated mock data from interface:', mockData);

          if (currentEditRule) {
            setCurrentEditRule({ ...currentEditRule, overrideTxt: JSON.stringify(mockData, null, 2) });
          }
          return;
        } else {
          throw new Error('无法解析 TypeScript 接口，请检查格式');
        }
      }

      // More sophisticated column parsing to handle nested objects in render functions
      const columnMatches: string[] = [];
      let depth = 0;
      let currentColumn = '';
      let inColumn = false;

      for (let i = 0; i < columnsText.length; i++) {
        const char = columnsText[i];

        if (char === '{') {
          if (!inColumn && columnsText.substr(i).includes('dataIndex')) {
            inColumn = true;
            currentColumn = '{';
            depth = 1;
          } else if (inColumn) {
            currentColumn += char;
            depth++;
          }
        } else if (char === '}' && inColumn) {
          currentColumn += char;
          depth--;
          if (depth === 0) {
            columnMatches.push(currentColumn);
            inColumn = false;
            currentColumn = '';
          }
        } else if (inColumn) {
          currentColumn += char;
        }
      }

      if (columnMatches.length === 0) {
        // Fallback to simple dataIndex extraction
        const simpleMatches = columnsText.match(/dataIndex\s*:\s*['"`](\w+)['"`]/g);
        if (!simpleMatches) throw new Error('无法提取字段，请确认格式中含有 dataIndex');

        const fields = simpleMatches.map((line) => line.match(/['"`](\w+)['"`]/)?.[1] || '');

        const mockContent = Array.from({ length: 10 }, (_, i) => {
          const obj: Record<string, any> = {
            uuid: `uuid-${crypto.randomUUID()}`,
          };
          fields.forEach((field) => {
            obj[field] = mockValue(field, i + 1);
          });
          return obj;
        });

        // Continue with existing structure...
        const mockData = {
          code: 200,
          data: {
            content: mockContent,
            pageNumber: "1",
            pageSize: "10",
            totalPages: "27",
            totalRecords: "266"
          },
          messageCn: "",
          messageEn: "",
          success: true
        };

        console.log('Generated mock data:', mockData);
        if (currentEditRule) {
          setCurrentEditRule({ ...currentEditRule, overrideTxt: JSON.stringify(mockData, null, 2) });
        }
        return;
      }

      // Enhanced analysis for full column definitions
      console.log(`Analyzing ${columnMatches.length} column definitions...`);

      const analyzedColumns: ColumnInfo[] = [];
      columnMatches.forEach((columnText, index) => {
        try {
          const columnInfo = analyzeColumn(columnText);
          if (columnInfo.dataIndex) {
            analyzedColumns.push(columnInfo);
            console.log(`Column ${index + 1}: ${columnInfo.dataIndex} -> ${columnInfo.detectedType}`,
                       columnInfo.mappedValues ? `(mapped: ${Object.keys(columnInfo.mappedValues).length} values)` : '');
          }
        } catch (e) {
          console.warn(`Failed to analyze column ${index + 1}:`, e);
        }
      });

      if (analyzedColumns.length === 0) {
        throw new Error('无法分析任何列定义，请检查格式');
      }

      // Generate mock data with enhanced analysis
      const mockContent = Array.from({ length: 10 }, (_, i) => {
        const obj: Record<string, any> = {
          uuid: `uuid-${crypto.randomUUID()}`,
        };

        analyzedColumns.forEach((columnInfo) => {
          const value = generateMockValue(columnInfo, i);
          obj[columnInfo.dataIndex] = value;

          // For location fields, also generate the individual location components
          if (columnInfo.dataIndex === 'location' && columnInfo.detectedType === 'location') {
            const countries = ['中国', '美国', '德国', '日本'];
            const provinces = ['广东省', '江苏省', '浙江省', '北京市', '上海市'];
            const cities = ['深圳市', '苏州市', '杭州市', '朝阳区', '浦东新区'];

            obj.countryName = countries[i % countries.length];
            obj.province = provinces[i % provinces.length];
            obj.city = cities[i % cities.length];
          }

          // For mapped fields with isMerge logic, add the isMerge field
          if (columnInfo.render && columnInfo.render.includes('isMerge === 2')) {
            obj.isMerge = [1, 2, 3][i % 3];
          }
        });

        return obj;
      })

      // Wrap the generated data in the new structure
      const mockData = {
        code: 200,
        data: {
          content: mockContent,
          pageNumber: "1",
          pageSize: "10",
          totalPages: "27",
          totalRecords: "266"
        },
        messageCn: "",
        messageEn: "",
        success: true
      }

      console.log(mockData)

      // Set the structured mock data to the JSON editor
      if (currentEditRule) {
        setCurrentEditRule({
          ...currentEditRule,
          overrideTxt: JSON.stringify(mockData, null, 2),
        });
      }
      message.success('✅ Mock data generated and pasted to JSON editor!')
    } catch (err: any) {
      message.error('❌ 解析失败: ' + err.message)
    }
  };

  return (
    <Spin spinning={isLoading}>
      <AnimatePresence>
        {!switchOn && (
          <motion.div
            key="lock-screen"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
            }}
            // initial={{ opacity: 0, scale: 0.2 }}
            // animate={{ opacity: 1, scale: 1 }}
            // exit={{ opacity: 0, scale: 1.2 }}
            // transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          >
            <motion.div
              key="lock"
              initial={{ opacity: 0, scale: 0.2 }}
              animate={{
                opacity: 1,
                scale: 1.5,
                transition: { duration: 0.5, type: "spring", delay: 0.5 },
              }}
              exit={{
                opacity: 0,
                scale: 1.8,
                transition: { duration: 0.5, type: "spring", delay: 0.1 },
              }}
              // transition={{ duration: 0.5, type: "spring",delay: 0.5 }}
            >
              <div
                className="lock-btn"
                onClick={() => {
                  // setSwitchOn(true);
                  handleSwitchChange();
                }}
              >
                <IconComponent icon={BiSolidLock} />
              </div>
            </motion.div>
            <motion.div
              key="lock-text"
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.3, type: "spring", delay: 0.8 },
              }}
              exit={{
                opacity: 0,
                y: 10,
                transition: { duration: 0.3, type: "spring", delay: 0 },
              }}
              // transition={{ duration: 0.3, type: "spring",delay: 0.8 }}
            >
              <p style={{ fontSize: 16, fontStyle: "italic", color: "#999" }}>
                Click to enable monitor
              </p>
            </motion.div>
          </motion.div>
        )}

        {switchOn && (
          <motion.div
            key="main-content"
            style={{
              width: "100%",
              height: "100%",
              padding: "20px",
              boxSizing: "border-box",
              position: "relative",
            }}
            // initial={{ opacity: 0, y: 20 }}
            // animate={{ opacity: 1, y: 0, transition: { duration: 0.5, type: "spring" } }}
            // exit={{ opacity: 0, y: -20, transition: { duration: 0.3, type: "spring",delay: 0 } }}
            // transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
          >
            <motion.div
              key="header-box"
              style={{
                padding: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                boxSizing: "border-box",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, type: "spring", delay: 0.5 },
              }}
              exit={{
                opacity: 0,
                y: 10,
                transition: { duration: 0.3, type: "spring", delay: 0.3 },
              }}
              // transition={{ duration: 0.3, type: "spring",delay: 1.5 }}
            >
              <div className="lock-btn small" onClick={handleSwitchChange}>
                <IconComponent
                  icon={switchOn ? BiSolidLockOpen : BiSolidLock}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Input.Search
                  style={{
                    width: 200,
                  }}
                  placeholder="Searchss by name"
                  onPressEnter={handleSearch}
                />
                <Input.Search
                  style={{
                    width: 200,
                  }}
                  placeholder="Search by url"
                  onPressEnter={handleUrlSearch}
                />
                <Upload {...uploadProps}>
                  <Button
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "4px",
                    }}
                    color="primary"
                    variant="filled"
                    icon={
                      <IconComponent
                        icon={FaFileImport}
                        style={{ marginBottom: -1 }}
                      />
                    }
                  />
                </Upload>
                <Button
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 4,
                  }}
                  color="primary"
                  variant="filled"
                  onClick={() => handleExportRules()}
                  icon={
                    <IconComponent
                      icon={FaFileExport}
                      style={{ marginBottom: -1 }}
                    />
                  }
                />

                <Button type="primary" onClick={handleAddNewRule}>
                  <PlusOutlined />
                  Add Rule
                </Button>

              </div>
            </motion.div>
            <motion.div
              key="table-box"
              ref={tableBoxRef}
              style={{
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                height: "calc(100% - 84px)",
                position: "relative",
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.3, type: "spring", delay: 0.8 },
              }}
              exit={{
                opacity: 0,
                y: 10,
                transition: { duration: 0.3, type: "spring", delay: 0 },
              }}
              // transition={{ duration: 0.3, type: "spring",delay: 0.8 }}
            >
              <Table
                bordered
                pagination={{
                  pageSize: 20,
                  total: rules.length,
                  showTotal: (total, range) => `Total: ${total}`,
                  showSizeChanger: true,
                }}
                style={{
                  height: "100%",
                  opacity: switchOn ? 1 : 0.65,
                }}
                scroll={{ y: tableBoxHeight - 78 }}
                size="small"
                columns={tableColumns}
                dataSource={rules}
              />
            </motion.div>
            <Drawer
              maskClosable={false}
              width={1200}
              title={
                isCreating
                  ? "Create new rule"
                  : "Detail for " + currentEditRule?.label
              }
              open={showDetail}
              onClose={() => {
                setShowDetail(false);
                setIsCreating(false);
                setDuplicateMatch([]);
              }}
              extra={
                <Space>
                  <Button onClick={() => setShowDetail(false)}>Cancel</Button>
                  <Button type="primary" onClick={handleUpdateRules}>
                    OK
                  </Button>
                </Space>
              }
            >
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  height: "100%",
                  overflowY: "scroll",
                }}
              >
                <div
                  style={{
                    width: 500,
                  }}
                >
                  <Typography.Title
                    level={4}
                    style={{
                      marginTop: 0,
                    }}
                  >
                    Id:
                  </Typography.Title>

                  <Space.Compact
                    style={{
                      width: "100%",
                    }}
                  >
                    <Input
                      style={{
                        marginBottom: "10px",
                      }}
                      disabled
                      value={currentEditRule?.id || ""}
                    />
                    <Button
                      type="primary"
                      icon={<CopyOutlined />}
                      onClick={() => {
                        navigator.clipboard.writeText(
                          currentEditRule?.id || ""
                        );
                        message.success("Copied to clipboard");
                      }}
                    ></Button>
                  </Space.Compact>
                  <Typography.Title level={4}>Label:</Typography.Title>
                  <Space.Compact
                    style={{
                      width: "100%",
                    }}
                  >
                    <Input
                      style={{
                        marginBottom: "10px",
                      }}
                      value={currentEditRule?.label || ""}
                      onChange={(e) => {
                        if (currentEditRule) {
                          setCurrentEditRule({
                            ...currentEditRule,
                            label: e.target.value,
                          });
                        }
                      }}
                    />
                    <Button
                      type="primary"
                      icon={<IconComponent icon={MdOutlineRefresh} />}
                      onClick={() => {
                        if (currentEditRule) {
                          setCurrentEditRule({
                            ...currentEditRule,
                            label:
                              currentEditRule.match.split("/")[
                                currentEditRule.match.split("/").length - 1
                              ],
                          });
                        }
                        message.success("Refresh from match");
                      }}
                    ></Button>
                  </Space.Compact>
                  <Typography.Title level={4}>Match:</Typography.Title>
                  <Space.Compact
                    style={{
                      width: "100%",
                    }}
                  >
                    <Input.TextArea
                      rows={10}
                      style={{
                        marginBottom: "10px",
                      }}
                      onBlur={checkDuplicateMatch}
                      value={currentEditRule?.match || ""}
                      onChange={(e) => {
                        if (currentEditRule) {
                          let newItem = {
                            ...currentEditRule,
                            match: e.target.value,
                          };
                          if (!currentEditRule.label) {
                            newItem.label =
                              e.target.value.split("/")[
                                e.target.value.split("/").length - 1
                              ];
                          }
                          console.log(newItem);
                          setCurrentEditRule(newItem);
                        }
                      }}
                    />
                    <Button
                      type="primary"
                      icon={<IconComponent icon={MdContentPaste} />}
                      onClick={() => {
                        navigator.clipboard.readText().then((text) => {
                          if (currentEditRule) {
                            setCurrentEditRule({
                              ...currentEditRule,
                              match: text,
                            });
                          }
                        });
                        message.success("Paste from clipboard");
                      }}
                    ></Button>
                  </Space.Compact>
                  {duplicateMatch.length > 0 && isCreating && (
                    <Collapse
                      size="small"
                      defaultActiveKey={["1"]}
                      items={[
                        {
                          key: "1",
                          label: "Duplicate match: " + duplicateMatch.length,
                          children: (
                            <>
                              {duplicateMatch.map((rule) => (
                                <Typography.Text
                                  className="duplicate-match"
                                  key={rule.id}
                                  onClick={() => {
                                    setIsCreating(false);
                                    setCurrentEditRule(rule);
                                    setShowDetail(true);
                                  }}
                                >
                                  {rule.match}
                                </Typography.Text>
                              ))}
                            </>
                          ),
                        },
                      ]}
                    />
                  )}
                  
                  {isCreating && (
                    <>
                      <Typography.Title level={4}>Generate Mock Data:</Typography.Title>
                      <Input.TextArea
                        rows={6}
                        placeholder="粘贴 columns 数组（包含 dataIndex）或 TypeScript 接口"
                        value={columnsInput}
                        onChange={(e) => {
                          const value = e.target.value;
                          setColumnsInput(value);
                          setContentType(detectContentType(value));
                        }}
                        style={{
                          marginBottom: "4px",
                        }}
                      />
                      <div style={{
                        fontSize: "12px",
                        color: "#666",
                        marginBottom: "10px",
                        minHeight: "16px"
                      }}>
                        {contentType === 'typescript' && "🔍 检测到 TypeScript 接口 - 将解析类型信息和注释"}
                        {contentType === 'columns' && "🔍 检测到 Ant Design 列配置 - 将分析 render 函数"}
                        {contentType === 'unknown' && columnsInput.trim() && "⚠️ 未识别的格式 - 请粘贴 columns 数组或 TypeScript 接口"}
                      </div>
                      <Button
                        type="primary"
                        icon={<ToolFilled />}
                        onClick={handleGenerateMockData}
                        disabled={!columnsInput.trim()}
                        style={{
                          marginBottom: "10px",
                        }}
                      >
                        Generate Mock Data
                      </Button>
                    </>
                  )}
                </div>

                <JsonEditor
                  rootName=""
                  className="json-editor"
                  data={JSON.parse(currentEditRule?.overrideTxt || "{}")}
                  setData={handleRulesChange}
                />
              </div>
            </Drawer>

          </motion.div>
        )}
      </AnimatePresence>
    </Spin>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
