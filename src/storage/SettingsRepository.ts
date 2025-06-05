import { ISettings } from '../models/SettingsModel';

export class SettingsRepository {
  private settings: ISettings[] = [];

  async getAllSettingss(): Promise<ISettings[]> {
    return this.settings;
  }

  async getSettingsById(id: string): Promise<ISettings | null> {
    return this.settings.find(item => item.id === id) || null;
  }

  async saveSettings(item: ISettings): Promise<ISettings> {
    const existing = this.settings.findIndex(i => i.id === item.id);
    if (existing >= 0) {
      this.settings[existing] = item;
    } else {
      this.settings.push(item);
    }
    return item;
  }

  async deleteSettings(id: string): Promise<boolean> {
    const index = this.settings.findIndex(item => item.id === id);
    if (index >= 0) {
      this.settings.splice(index, 1);
      return true;
    }
    return false;
  }
}

export default new SettingsRepository();
