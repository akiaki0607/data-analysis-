export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  description: string;
  image: string;
  results: {
    metric: string;
    value: string;
  }[];
  tags: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  image?: string;
}

export interface ContactFormData {
  name: string;
  company: string;
  phone: string;
  email: string;
  message: string;
}

export interface Statistic {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
}

