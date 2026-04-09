import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Spin, Typography, Pagination, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import MainHeader from '../../components/MainHeader/MainHeader';
import MainFooter from '../../components/MainFooter/MainFooter';
import Section from '../../components/Section/Section';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { useTitle } from '../../hooks/useTitle';
import { formatDate } from '../../utils/helper';

type NewsRow = {
  id: string;
  images?: string[] | string | null;
  description?: string | null;
  createdAt?: string | Date;
};

const DEFAULT_LIMIT = 9;
const API_BASE =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3030');

function newsImageSrc(images: NewsRow['images']): string {
  const normalize = (src: string): string => {
    if (!src) return '';
    if (/^https?:\/\//i.test(src)) return src;
    if (src.startsWith('/')) return `${API_BASE.replace(/\/$/, '')}${src}`;
    return `${API_BASE.replace(/\/$/, '')}/${src.replace(/^\//, '')}`;
  };
  if (Array.isArray(images)) return normalize(images[0] || '');
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images || '[]');
      if (Array.isArray(parsed) && parsed[0]) return normalize(String(parsed[0]));
      return normalize(images);
    } catch {
      return normalize(images);
    }
  }
  return '';
}

const News: React.FC = () => {
  const { t } = useTranslation();
  useTitle(t('common.news'));

  const [items, setItems] = useState<NewsRow[]>([]);
  const [latestItems, setLatestItems] = useState<NewsRow[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [appliedKeyword, setAppliedKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: DEFAULT_LIMIT, total: 0 });

  const fetchNews = useCallback(async (page = 1, limit = DEFAULT_LIMIT, keyword = '') => {
    try {
      setLoading(true);
      const q = keyword.trim();
      const query = q ? `&q=${encodeURIComponent(q)}` : '';
      const res = await api.get(`/news?page=${page}&limit=${limit}${query}`);
      const payload = res.data?.data ?? res.data;
      const list: NewsRow[] = payload?.items ?? [];
      const meta = payload?.meta;

      setItems(list);
      setPagination({
        current: meta?.page ?? page,
        pageSize: meta?.limit ?? limit,
        total: meta?.total ?? list.length,
      });
    } catch (e: any) {
      console.error(e);
      toast.error(e?.response?.data?.message || 'Không tải được tin tức');
    } finally {
      setLoading(false);
    }
  }, [t]);

  const fetchLatestNews = useCallback(async () => {
    try {
      const res = await api.get('/news/latest');
      const payload = res.data?.data ?? res.data;
      const list: NewsRow[] = Array.isArray(payload) ? payload : [];
      setLatestItems(list);
    } catch (e: any) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchNews(1, DEFAULT_LIMIT, '');
    fetchLatestNews();
  }, [fetchNews, fetchLatestNews]);

  const handleSearch = (value?: string) => {
    const next = (value ?? searchKeyword).trim();
    setAppliedKeyword(next);
    fetchNews(1, pagination.pageSize, next);
  };

  return (
    <Fragment>
      <MainHeader sticky />
      <Section spaceBottom>
        <div className="content mx-auto news-page">
          <h2 className="max-w-4xl mx-auto mb-0 text-4xl font-semibold tracking-tight text-center text-balance sm:text-5xl">
            {t('common.news')}
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Spin size="large" tip={t('common.loading')} />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 mt-12 lg:grid-cols-12">
              <div className="lg:col-span-8">
                {items.length === 0 ? (
                  <div className="py-20 text-center text-text3">{t('common.noData')}</div>
                ) : (
                  <div className="space-y-5">
                    {items.map((n) => {
                      const img0 = newsImageSrc(n.images);
                      const dateStr = n.createdAt ? formatDate(String(n.createdAt)) : '';
                      return (
                        <div
                          key={n.id}
                          className="overflow-hidden bg-white border border-gray-border rounded-2xl shadow-sm"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3">
                            <div className="w-full overflow-hidden bg-gray-50 aspect-[4/3] md:aspect-[1/1] md:col-span-1">
                              {img0 ? (
                                <img
                                  src={img0}
                                  alt=""
                                  className="block w-full h-full object-cover object-center"
                                />
                              ) : (
                                <div className="flex items-center justify-center w-full h-full text-gray-400">
                                  {t('common.noImage')}
                                </div>
                              )}
                            </div>
                            <div className="p-5 md:col-span-2">
                              <div className="text-xs text-text3">{dateStr || '—'}</div>
                              <Typography.Paragraph
                                className="mt-3 mb-0"
                                ellipsis={{ rows: 3, expandable: false }}
                              >
                                {n.description || '—'}
                              </Typography.Paragraph>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {items.length > 0 && (
                  <div className="flex justify-center mt-10">
                    <Pagination
                      current={pagination.current}
                      pageSize={pagination.pageSize}
                      total={pagination.total}
                      onChange={(page) => fetchNews(page, pagination.pageSize, appliedKeyword)}
                    />
                  </div>
                )}
              </div>

              <aside className="lg:col-span-4">
                <div className="sticky space-y-6 top-24">
                  <div className="p-4 bg-white border rounded-2xl border-gray-border">
                    <p className="mb-3 text-sm font-semibold text-text1">{t('common.search')}</p>
                    <Input
                      allowClear
                      placeholder={t('common.search')}
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      onPressEnter={() => handleSearch()}
                      onBlur={() => handleSearch()}
                    />
                  </div>

                  <div className="p-4 bg-white border rounded-2xl border-gray-border">
                    <p className="mb-4 text-sm font-semibold text-text1">Bài viết mới</p>
                    <div className="space-y-4">
                      {latestItems.slice(0, 5).map((n) => {
                        const img0 = newsImageSrc(n.images);
                        const dateStr = n.createdAt ? formatDate(String(n.createdAt)) : '';
                        return (
                          <div key={`latest-${n.id}`} className="flex items-start gap-3">
                            <div className="w-16 h-16 overflow-hidden rounded-lg bg-gray-50 shrink-0">
                              {img0 ? (
                                <img
                                  src={img0}
                                  alt=""
                                  className="block object-cover object-center w-full h-full"
                                />
                              ) : (
                                <div className="flex items-center justify-center w-full h-full text-[10px] text-gray-400">
                                  {t('common.noImage')}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="mb-1 text-[11px] text-text3">{dateStr || '—'}</p>
                              <Typography.Paragraph
                                className="mb-0 text-sm"
                                ellipsis={{ rows: 2, expandable: false }}
                              >
                                {n.description || '—'}
                              </Typography.Paragraph>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </Section>
      <MainFooter />
    </Fragment>
  );
};

export default News;

