from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'MetodosNumericos.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^Polinomial/$', 'Polinomial.views.index'),
    url(r'^Polinomial_2/$', 'Polinomial_2.views.index'),
    url(r'^Compute_Polinomial/$', 'Polinomial_2.views.compute_pol'),
)
