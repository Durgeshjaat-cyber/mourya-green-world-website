import { useEffect } from 'react';
import { useParams, Link } from 'wouter';
import { motion } from 'framer-motion';
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { blogPosts } from '@/data/blog';
import { usePublicData } from '@/contexts/AdminContext';
import { Badge } from '@/components/ui/badge';

const BLOG_EMOJIS: Record<string, string> = {
  'b1': '🌿', 'b2': '🍀', 'b3': '💨', 'b4': '🌧️', 'b5': '🌱', 'b6': '🌵',
};

export default function BlogDetail() {
  const { settings } = usePublicData();
  const params = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === params.slug);
  const related = post ? blogPosts.filter(p => p.id !== post.id).slice(0, 3) : [];

  useEffect(() => {
    if (post) document.title = `${post.title} — Mourya Green World`;
    window.scrollTo(0, 0);
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-6xl">📝</p>
        <h2 className="font-serif text-2xl font-bold">Article not found</h2>
        <Link href="/blog"><a className="text-primary hover:underline">Back to Blog</a></Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-16">
      <div className="container mx-auto px-4 max-w-3xl pt-6 pb-4">
        <Link href="/blog">
          <a className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </a>
        </Link>
      </div>

      <article className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="outline" className="text-primary border-primary/30">{post.category}</Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime}</span>
            <span className="text-xs text-muted-foreground">{post.date}</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">{post.title}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">{post.excerpt}</p>
        </motion.div>

        {/* Feature Image */}
        <div className="aspect-video bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl mb-10 flex items-center justify-center text-[100px]">
          {BLOG_EMOJIS[post.id]}
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="prose prose-green max-w-none mb-10"
        >
          {post.content.split('\n\n').map((para, i) => (
            <p key={i} className="text-foreground leading-relaxed mb-4 text-base">
              {para}
            </p>
          ))}
        </motion.div>

        {/* Author */}
        <div className="flex items-center gap-4 py-6 border-t border-b border-border mb-10">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">🌿</div>
          <div>
            <p className="font-semibold text-foreground">Mourya Green World Team</p>
            <p className="text-sm text-muted-foreground">Plant experts in Noida since 2019</p>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <div className="bg-gradient-to-br from-primary/10 to-emerald-50 rounded-2xl p-8 text-center mb-12">
          <h3 className="font-serif text-2xl font-bold text-foreground mb-3">Need Plant Advice?</h3>
          <p className="text-muted-foreground mb-6">
            Have questions about caring for your plants? Our experts are just a WhatsApp message away.
          </p>
          <a
            href={`https://wa.me/${settings.whatsappPrimary}?text=Hi%2C%20I%20read%20your%20blog%20and%20have%20a%20plant%20question!`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#1da851] transition-colors shadow-lg"
          >
            <FaWhatsapp className="h-5 w-5" />
            Chat with Plant Experts
          </a>
        </div>
      </article>

      {/* Related Articles */}
      {related.length > 0 && (
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6">More Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map(r => (
              <Link key={r.id} href={`/blog/${r.slug}`}>
                <a className="group block bg-card border border-card-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-5xl">
                    {BLOG_EMOJIS[r.id]}
                  </div>
                  <div className="p-4">
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors text-sm line-clamp-2">{r.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Clock className="h-3 w-3" />{r.readTime}</p>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
