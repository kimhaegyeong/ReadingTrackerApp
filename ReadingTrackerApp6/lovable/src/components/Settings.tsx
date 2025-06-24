import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Download, Upload, Trash2, User, Bell, Palette, Database } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Settings = ({ onBack }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoBackup: true,
    readingGoal: '24',
    userName: '독서러버'
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleBackup = () => {
    const data = {
      books: JSON.parse(localStorage.getItem('books') || '[]'),
      readingSessions: JSON.parse(localStorage.getItem('readingSessions') || '[]'),
      settings: settings,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `리브노트_백업_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    toast({
      title: "백업 완료",
      description: "데이터가 성공적으로 백업되었습니다."
    });
  };

  const handleRestore = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = e.target?.result;
          if (typeof result === 'string') {
            const data = JSON.parse(result);
            localStorage.setItem('books', JSON.stringify(data.books || []));
            localStorage.setItem('readingSessions', JSON.stringify(data.readingSessions || []));
            toast({
              title: "복원 완료",
              description: "데이터가 성공적으로 복원되었습니다."
            });
          }
        } catch (error) {
          toast({
            title: "오류",
            description: "백업 파일을 읽을 수 없습니다.",
            variant: "destructive"
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDeleteAllData = () => {
    if (confirm('모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      localStorage.clear();
      toast({
        title: "데이터 삭제",
        description: "모든 데이터가 삭제되었습니다."
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">설정</h1>
            <p className="text-gray-600">앱 설정을 관리하세요</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* 사용자 설정 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <span>사용자 설정</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="userName">사용자 이름</Label>
                <Input
                  id="userName"
                  value={settings.userName}
                  onChange={(e) => handleSettingChange('userName', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="readingGoal">연간 독서 목표 (권)</Label>
                <Input
                  id="readingGoal"
                  type="number"
                  value={settings.readingGoal}
                  onChange={(e) => handleSettingChange('readingGoal', e.target.value)}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* 알림 설정 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-green-600" />
                <span>알림 설정</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">독서 알림</Label>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                />
              </div>
              <p className="text-sm text-gray-500">일정한 시간에 독서 알림을 받습니다</p>
            </CardContent>
          </Card>

          {/* 테마 설정 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5 text-purple-600" />
                <span>테마 설정</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="darkMode">다크 모드</Label>
                <Switch
                  id="darkMode"
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* 데이터 관리 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-orange-600" />
                <span>데이터 관리</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoBackup">자동 백업</Label>
                <Switch
                  id="autoBackup"
                  checked={settings.autoBackup}
                  onCheckedChange={(checked) => handleSettingChange('autoBackup', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button onClick={handleBackup} className="flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>데이터 백업</span>
                </Button>
                
                <div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleRestore}
                    className="hidden"
                    id="restore-input"
                  />
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center space-x-2"
                    onClick={() => document.getElementById('restore-input').click()}
                  >
                    <Upload className="h-4 w-4" />
                    <span>데이터 복원</span>
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <Button 
                variant="destructive" 
                onClick={handleDeleteAllData}
                className="w-full flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>모든 데이터 삭제</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
