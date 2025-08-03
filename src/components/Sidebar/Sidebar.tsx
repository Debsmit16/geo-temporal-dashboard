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
    <Card className="animate-slide-up hover:shadow-lg transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <input
            type="text"
            value={rule.label}
            onChange={(e) => handleLabelChange(e.target.value)}
            className="text-sm font-semibold bg-transparent border-none outline-none flex-1 text-slate-700 dark:text-slate-300"
            placeholder="Rule label"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
          >
            <Trash2 className="h-4 w-4" />
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
      </CardContent>
    </Card>
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
    <>
      {/* Mobile Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 lg:w-96 glass border-l border-white/20 shadow-2xl z-50 overflow-y-auto animate-slide-up lg:relative lg:shadow-none lg:border-l-0">
        <div className="p-4 sm:p-6">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center float">
              <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200">Polygon Settings</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 hidden sm:block">Configure your polygon</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="h-8 w-8 sm:h-10 sm:w-10 p-0 rounded-lg sm:rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-600 transition-all hover-lift"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>

        {/* Polygon Name Card */}
        <Card className="mb-6 hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              <CardTitle className="text-base">Polygon Identity</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <input
              type="text"
              value={selectedPolygon.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
              placeholder="Enter polygon name"
            />
          </CardContent>
        </Card>

        {/* Data Source Card */}
        <Card className="mb-6 hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Thermometer className="h-4 w-4 text-green-500" />
              <CardTitle className="text-base">Data Source</CardTitle>
            </div>
            <CardDescription>Choose your weather data provider</CardDescription>
          </CardHeader>
          <CardContent>
            <select
              value={selectedPolygon.dataSource}
              onChange={(e) => handleDataSourceChange(e.target.value)}
              className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="open-meteo">Open-Meteo (Temperature)</option>
            </select>
            <div className="mt-3 flex items-center space-x-2">
              <Badge variant="success" className="text-xs">
                Live Data
              </Badge>
              <Badge variant="info" className="text-xs">
                No API Key Required
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Color Rules Card */}
        <Card className="mb-6 hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Palette className="h-4 w-4 text-purple-500" />
                <CardTitle className="text-base">Color Rules</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddRule}
                className="h-9 px-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:border-blue-300 transition-all"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Rule
              </Button>
            </div>
            <CardDescription>Define temperature-based color coding</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedPolygon.colorRules.map((rule) => (
                <ColorRuleEditor
                  key={rule.id}
                  rule={rule}
                  onUpdate={(updatedRule) => handleRuleUpdate(rule.id, updatedRule)}
                  onDelete={() => handleRuleDelete(rule.id)}
                />
              ))}
              {selectedPolygon.colorRules.length === 0 && (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <Palette className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No color rules defined</p>
                  <p className="text-xs">Add a rule to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Polygon Info Card */}
        <Card className="mb-6 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 border-slate-200 dark:border-slate-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-slate-700 dark:text-slate-300">Polygon Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Points</div>
                <div className="text-lg font-bold text-slate-700 dark:text-slate-300">{selectedPolygon.coordinates.length}</div>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Created</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{new Date(selectedPolygon.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Current Color</div>
              <div className="flex items-center space-x-3">
                <div
                  className="w-8 h-8 rounded-lg border-2 border-white dark:border-slate-600 shadow-sm"
                  style={{ backgroundColor: selectedPolygon.currentColor }}
                />
                <code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400">
                  {selectedPolygon.currentColor}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={handleDuplicate}
            className="w-full h-12 rounded-xl border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 transition-all"
          >
            <Copy className="h-4 w-4 mr-2" />
            Duplicate Polygon
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Polygon
          </Button>
        </div>
        </div>
      </div>
    </>
  );
}
