import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Spin, Typography, Pagination } from 'antd';
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
  images?: string[] | null;
  description?: string | null;
  createdAt?: string | Date;
};

const DEFAULT_LIMIT = 9;

const News: React.FC = () => {
  const { t } = useTranslation();
  useTitle(t('common.news'));

  const [items, setItems] = useState<NewsRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: DEFAULT_LIMIT, total: 0 });

  const fetchNews = useCallback(async (page = 1, limit = DEFAULT_LIMIT) => {
    try {
      setLoading(true);
      const res = await api.get(`/news?page=${page}&limit=${limit}`);
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

  useEffect(() => {
    fetchNews(1, DEFAULT_LIMIT);
  }, [fetchNews]);

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
            <>
              {items.length === 0 ? (
                <div className="py-20 text-center text-text3">{t('common.noData')}</div>
              ) : (
                <div className="grid grid-cols-1 gap-6 mt-12 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((n) => {
                    const img0 = Array.isArray(n.images) ? n.images[0] : null;
                    const dateStr = n.createdAt ? formatDate(String(n.createdAt)) : '';
                    return (
                      <div
                        key={n.id}
                        className="overflow-hidden bg-white border border-gray-border rounded-2xl shadow-sm"
                      >
                        <div className="w-full aspect-[3/2] bg-gray-50">
                          {img0 ? (
                            <img src={img0} alt="" className="object-cover w-full h-full" />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full text-gray-400">
                              {t('common.noImage')}
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <div className="text-xs text-text3">{dateStr || '—'}</div>
                          <Typography.Paragraph
                            className="mt-3 mb-0"
                            ellipsis={{ rows: 5, expandable: false }}
                          >
                            {n.description || '—'}
                          </Typography.Paragraph>
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
                    onChange={(page) => fetchNews(page, pagination.pageSize)}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </Section>
      <MainFooter />
    </Fragment>
  );
};

export default News;

