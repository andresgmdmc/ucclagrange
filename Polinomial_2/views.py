import json
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_protect
from models import InputForm
from compute import *

def index(request):
	s = None
	if request.method == 'POST':
		form = InputForm(request.POST)
		if form.is_valid():
			form = form.save(commit=False)
			r = form.r
			s = compute(r)
	else:
		form = InputForm()

	return render_to_response('Templates/Polinomial_2.html', 
			{'form': form,
			's': '%.5f' % s if isinstance(s, float) else ''}, 
			context_instance=RequestContext(request))

@csrf_protect
def compute_pol(request):
	query = None
	result = None	
	if request.method == 'POST':

		query = request.body
		received_json_data = json.loads(query)

		result = lagrange(received_json_data)

		print result

	return HttpResponse(json.dumps(result), content_type="application/json")

