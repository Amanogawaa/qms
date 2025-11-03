// Application layer - Form Template use cases
import type {
  FormTemplate,
  CreateFormTemplateDTO,
  UpdateFormTemplateDTO,
} from '../domain/types';

export interface FormTemplateRepository {
  findAll(): Promise<FormTemplate[]>;
  findById(id: string): Promise<FormTemplate | null>;
  findBySlug(slug: string): Promise<FormTemplate | null>;
  create(data: CreateFormTemplateDTO): Promise<FormTemplate>;
  update(data: UpdateFormTemplateDTO): Promise<FormTemplate>;
  delete(id: string): Promise<void>;
  toggleActive(id: string, isActive: boolean): Promise<FormTemplate>;
}

export class FormTemplateService {
  constructor(private repository: FormTemplateRepository) {}

  async getAllTemplates(): Promise<FormTemplate[]> {
    return this.repository.findAll();
  }

  async getTemplateById(id: string): Promise<FormTemplate | null> {
    return this.repository.findById(id);
  }

  async createTemplate(data: CreateFormTemplateDTO): Promise<FormTemplate> {
    // Validate slug is unique
    const existing = await this.repository.findBySlug(data.slug);
    if (existing) {
      throw new Error(`Form template with slug "${data.slug}" already exists`);
    }

    return this.repository.create(data);
  }

  async updateTemplate(data: UpdateFormTemplateDTO): Promise<FormTemplate> {
    const template = await this.repository.findById(data.id);
    if (!template) {
      throw new Error(`Form template with id "${data.id}" not found`);
    }

    return this.repository.update(data);
  }

  async deleteTemplate(id: string): Promise<void> {
    const template = await this.repository.findById(id);
    if (!template) {
      throw new Error(`Form template with id "${id}" not found`);
    }

    return this.repository.delete(id);
  }

  async toggleTemplateActive(
    id: string,
    isActive: boolean
  ): Promise<FormTemplate> {
    return this.repository.toggleActive(id, isActive);
  }
}
