'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ColorRule } from '@/types';
import { useSelectedPolygon, usePolygonActions, useSidebarOpen, useUIActions } from '@/store';
import { generateId } from '@/utils';
import { X, Plus, Trash2, Copy, Settings, Palette, MapPin, Thermometer } from 'lucide-react';

interface ColorRuleEditorProps {
  rule: ColorRule;
  onUpdate: (rule: ColorRule) => void;
  onDelete: () => void;
}

function ColorRuleEditor({ rule, onUpdate, onDelete }: ColorRuleEditorProps) {
  const handleConditionChange = (condition: ColorRule['condition']) => {
    onUpdate({ ...rule, condition });
  };

  const handleValue1Change = (value: string) => {
    onUpdate({ ...rule, value1: parseFloat(value) || 0 });
  };

  const handleValue2Change = (value: string) => {
    onUpdate({ ...rule, value2: parseFloat(value) || 0 });
  };

  const handleColorChange = (color: string) => {
    onUpdate({ ...rule, color });
  };

  const handleLabelChange = (label: string) => {
    onUpdate({ ...rule, label });
  };

  return (
    <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
      <div className="flex items-center justify-between mb-3">
        <input
          type="text"
          value={rule.label}
          onChange={(e) => handleLabelChange(e.target.value)}
          className="text-sm font-medium bg-transparent border-none outline-none flex-1 text-gray-900 dark:text-white"
          placeholder="Rule label"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

        <div className="space-y-3">
          <select
            value={rule.condition}
            onChange={(e) => handleConditionChange(e.target.value as ColorRule['condition'])}
            className="w-full p-3 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="less_than">Less than</option>
            <option value="between">Between</option>
            <option value="greater_than">Greater than</option>
          </select>

          <div className="flex gap-2">
            <input
              type="number"
              value={rule.value1}
              onChange={(e) => handleValue1Change(e.target.value)}
              className="flex-1 p-3 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Value"
            />
            {rule.condition === 'between' && (
              <input
                type="number"
                value={rule.value2 || ''}
                onChange={(e) => handleValue2Change(e.target.value)}
                className="flex-1 p-3 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Max value"
              />
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="color"
                value={rule.color}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-12 h-12 border-2 border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer shadow-sm hover:shadow-md transition-all"
              />
              <div className="absolute inset-0 rounded-xl ring-2 ring-white dark:ring-slate-800 pointer-events-none"></div>
            </div>
            <div className="flex-1">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Color Preview</span>
              <div
                className="mt-1 h-3 rounded-full shadow-inner"
                style={{ backgroundColor: rule.color }}
              ></div>
            </div>
          </div>
        </div>
    </div>
  );
}

export default function Sidebar() {
  const selectedPolygon = useSelectedPolygon();
  const sidebarOpen = useSidebarOpen();
  const { updatePolygon, removePolygon, duplicatePolygon } = usePolygonActions();
  const { setSidebarOpen } = useUIActions();

  if (!sidebarOpen || !selectedPolygon) {
    return null;
  }

  const handleNameChange = (name: string) => {
    updatePolygon(selectedPolygon.id, { name });
  };

  const handleDataSourceChange = (dataSource: string) => {
    updatePolygon(selectedPolygon.id, { dataSource });
  };

  const handleRuleUpdate = (ruleId: string, updatedRule: ColorRule) => {
    const updatedRules = selectedPolygon.colorRules.map(rule =>
      rule.id === ruleId ? updatedRule : rule
    );
    updatePolygon(selectedPolygon.id, { colorRules: updatedRules });
  };

  const handleRuleDelete = (ruleId: string) => {
    const updatedRules = selectedPolygon.colorRules.filter(rule => rule.id !== ruleId);
    updatePolygon(selectedPolygon.id, { colorRules: updatedRules });
  };

  const handleAddRule = () => {
    const newRule: ColorRule = {
      id: generateId(),
      condition: 'greater_than',
      value1: 20,
      color: '#808080',
      label: 'New Rule',
    };
    const updatedRules = [...selectedPolygon.colorRules, newRule];
    updatePolygon(selectedPolygon.id, { colorRules: updatedRules });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this polygon?')) {
      removePolygon(selectedPolygon.id);
      setSidebarOpen(false);
    }
  };

  const handleDuplicate = () => {
    duplicatePolygon(selectedPolygon.id);
  };

  return (
    <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Area Settings
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Configure selected polygon
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Polygon Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Area Name
          </label>
          <input
            type="text"
            value={selectedPolygon.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter area name"
          />
        </div>

        {/* Data Source */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Data Source
          </label>
          <select
            value={selectedPolygon.dataSource}
            onChange={(e) => handleDataSourceChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="open-meteo">Open-Meteo (Temperature)</option>
          </select>
          <div className="mt-2 flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Live Data
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              No API Key
            </span>
          </div>
        </div>

        {/* Color Rules */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Color Rules
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddRule}
              className="text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Rule
            </Button>
          </div>
          <div className="space-y-3">
            {selectedPolygon.colorRules.map((rule) => (
              <ColorRuleEditor
                key={rule.id}
                rule={rule}
                onUpdate={(updatedRule) => handleRuleUpdate(rule.id, updatedRule)}
                onDelete={() => handleRuleDelete(rule.id)}
              />
            ))}
            {selectedPolygon.colorRules.length === 0 && (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                <Palette className="h-6 w-6 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No color rules defined</p>
                <p className="text-xs mt-1">Add a rule to visualize data</p>
                </div>
              )}
            </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={handleDuplicate}
            className="w-full"
          >
            <Copy className="h-4 w-4 mr-2" />
            Duplicate Area
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="w-full"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Area
          </Button>
        </div>
      </div>
    </div>
  );
}
