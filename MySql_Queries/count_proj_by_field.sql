select a.field
	,a.status
    ,count(a.id)
from kicks.projects as a
group by a.field, a.status